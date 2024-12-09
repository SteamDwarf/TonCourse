import "@stdlib/ownable";
import "@stdlib/deploy";
import "./jettonMessages.tact";
import "./jetton_master.tact";

struct MarketData {
    jetton_price: Int as coins;
    jetton_master_address: Address;
    owner: Address;
}

contract JettonMarket with Deployable, Ownable {
    jetton_master: StateInit;
    jetton_master_address: Address;
    owner: Address;
    jetton_price: Int as coins;

    init(jetton_price: Int, jetton_content: Cell) {
        self.jetton_master = initOf JettonMaster(myAddress(), jetton_content);
        self.jetton_master_address = contractAddress(self.jetton_master);
        self.jetton_price = jetton_price;
        self.owner = sender();
    }

    receive(msg: Buy) {
        let ctx = context();
        let sum = msg.amount * self.jetton_price;

        require(ctx.value > sum + ton("0.1"), "Not enough tons");

        send(SendParameters{
            to: self.jetton_master_address, 
            value: ctx.value - sum - ctx.readForwardFee(),
            body: Transfer{
                query_id: msg.query_id,
                amount: msg.amount,
                reciever: sender(),
                response_destination: sender(),
                forward_ton_amount: 0,
                custom_payload: beginCell().endCell(),
                forward_payload: beginCell().endCell()
            }.toCell(),
            mode: SendIgnoreErrors,
            code: self.jetton_master.code,
            data: self.jetton_master.data
        })
    }

    receive("withdraw safe") {
        require(sender() == self.owner, "No permission");

        send(SendParameters{
            to: self.owner, 
            value: myBalance() - context().value - ton("0.01"),
            mode: SendRemainingValue + SendIgnoreErrors
        })
    }

    get fun get_data(): MarketData {
        return MarketData{
            jetton_price: self.jetton_price,
            jetton_master_address: self.jetton_master_address,
            owner: self.owner
        }
    }

    
}