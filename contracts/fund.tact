import "@stdlib/deploy";

message GiveMoney {
    amount: Int as uint32;
    address: Address;
}

message GetMoney {
    amount: Int as uint32;
}

contract Fund with Deployable {
    id: Int as uint32;
    money: Int as uint32;

    init(id: Int) {
        self.id = id;
        self.money = 100;
    }

    get fun money(): Int {
        return self.money;
    }

    receive(msg: GiveMoney) {
        require(self.money >= msg.amount, "We don`t have so much money");

        self.money -= msg.amount;
        send(SendParameters{
            to: msg.address, 
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: GetMoney{amount: msg.amount}.toCell()
        });
    }

    bounced(src: GetMoney) {
        self.money += src.amount;
    }
}
