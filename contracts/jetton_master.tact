import "@stdlib/deploy";
import "./jetton_wallet.tact";

struct JettonData {
    total_supply: Int;
    mintable: Bool;
    admin_address: Address;
    jetton_content: Cell;
    jetton_wallet_code: Cell;

}

contract JettonMaster with Deployable {
    total_supply: Int as uint32;
    mintable: Bool;
    admin_address: Address;
    jetton_content: Cell;
    jetton_wallet_code: Cell;

    init(owner: Address, jetton_content: Cell,) {
        self.total_supply = 0;
        self.jetton_content = jetton_content;
        self.mintable = true;
        self.admin_address = owner;
        self.jetton_wallet_code = initOf JettonWallet(sender(), myAddress()).code;
    }

    receive(msg: ChangeContent) {
        self.jetton_content = msg.jetton_content;
    }

    receive(msg: Transfer) {
        let ctx = context();
        require(self.mintable == true, "Not mintable");
        require(sender() == self.admin_address, "No permission");
        require(ctx.readForwardFee() * 2 + 2 * gasConsumption + minTons + msg.forward_ton_amount < ctx.value, "Invalid ton amount");

        let walletInit = initOf JettonWallet(msg.reciever, myAddress());
        let reciever = contractAddress(walletInit);

        self.total_supply += msg.amount;

        send(SendParameters{
            to: reciever, 
            value: 0,
            body: InternalTransfer{
                query_id: msg.query_id,
                amount: msg.amount,
                from: sender(),
                response_address: msg.response_destination,
                forward_ton_amount: msg.forward_ton_amount,
                forward_payload: msg.forward_payload
            }.toCell(),
            mode: SendRemainingValue + SendIgnoreErrors,
            code: walletInit.code,
            data: walletInit.data
        })
        
    }

    receive(msg: BurnNotification) {
        let walletInit = initOf JettonWallet(msg.sender, myAddress());
        let senderAddress = contractAddress(walletInit);

        require(sender() == senderAddress, "No permission");

        self.total_supply -= msg.amount;

        send(SendParameters{
            to: msg.response_destination, 
            value: 0,
            mode: SendRemainingValue,
            body: Excesses{query_id: msg.query_id}.toCell()
        })
    }

    bounced(src: bounced<InternalTransfer>) {
        self.total_supply -= src.amount;
    }

    receive("Stop Mint") {
        require(sender() == self.admin_address, "No permission");
        self.mintable = false;
    }

    get fun get_jetton_data(): JettonData {
        return JettonData{
            total_supply: self.total_supply,
            jetton_content: self.jetton_content,
            mintable: self.mintable,
            admin_address: self.admin_address,
            jetton_wallet_code: self.jetton_wallet_code,
        }
    }

    get fun get_wallet_address(owner_address: Address): Address {
        let walletInit = initOf JettonWallet(owner_address, myAddress());
        return contractAddress(walletInit);
    }
}
