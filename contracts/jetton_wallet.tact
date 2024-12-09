import "@stdlib/deploy";
import "./jettonMessages.tact";

const gasConsumption: Int = ton("0.02");
const minTons: Int = ton("0.01");

struct WalletData {
    balance: Int as coins;
    owner: Address;
    jetton: Address;
    jetton_wallet_code: Cell;
}

contract JettonWallet with Deployable {
    master: Address;
    owner: Address;
    balance: Int as coins;

    init(owner: Address, master: Address) {
        self.master = master;
        self.owner = owner;
        self.balance = 0;
    }

    receive(msg: Transfer) {
        let ctx: Context = context();

        require(sender() == self.owner, "No permissions");
        require(self.balance >= msg.amount, "Not enough jettons");
    
        let walletInit = initOf JettonWallet(msg.reciever, self.master);
        let reciever = contractAddress(walletInit);

        self.balance -= msg.amount;

        send(SendParameters{
            to: reciever, 
            value: 0,
            body: InternalTransfer{
                query_id: msg.query_id,
                amount: msg.amount,
                from: self.owner,
                response_address: msg.response_destination,
                forward_ton_amount: msg.forward_ton_amount,
                forward_payload: msg.forward_payload
            }.toCell(),
            mode: SendRemainingValue,
            code: walletInit.code,
            data: walletInit.data
        })
    }

    receive(msg: InternalTransfer) {
        if(sender() != self.master) {
            let walletInit = initOf JettonWallet(msg.from, self.master);
            require(contractAddress(walletInit) == sender(), "No permissions")
        }

        self.balance += msg.amount;

        if(msg.forward_ton_amount > 0) {
            send(SendParameters{
                to: msg.response_address,
                value: msg.forward_ton_amount,
                body: TransferNotification{
                    query_id: msg.query_id,
                    amount: msg.amount,
                    sender: msg.from,
                    forward_payload: msg.forward_payload
                }.toCell(),
                mode: SendIgnoreErrors,
            })
        } else {
            send(SendParameters{
                to: msg.response_address,
                value: 0,
                body: Excesses{
                    query_id: msg.query_id,
                }.toCell(),
                mode: SendRemainingValue,
            })
        }
    }

    receive(msg: Burn) {
        let ctx: Context = context();

        require(sender() == self.owner, "No permission");
        require(self.balance >= msg.amount, "Not enought jettons");
        require(ctx.value > gasConsumption + gasConsumption + ctx.readForwardFee(), "Invalid ton amount");

        self.balance -= msg.amount;

        send(SendParameters{
            to: self.master, 
            value: 0,
            body: BurnNotification{
                query_id: msg.query_id,
                amount: msg.amount,
                sender: self.owner,
                response_destination: msg.response_destination
            }.toCell(),
            mode: SendRemainingValue,
        })
    }

    bounced(src: bounced<InternalTransfer>) {
        self.balance += src.amount;
    }

    bounced(src: bounced<BurnNotification>) {
        self.balance += src.amount;
    }

    get fun get_wallet_data(): WalletData {
        return WalletData{
            balance: self.balance,
            owner: self.owner,
            jetton: self.master,
            jetton_wallet_code: initOf JettonWallet(self.owner, self.master).code
        }
    }
}
