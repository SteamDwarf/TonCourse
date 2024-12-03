import "@stdlib/deploy";

message GetMoney{
    amount: Int as uint32;
}

contract Company with Deployable {
    id: Int as uint32;
    money: Int as uint32;

    init(id: Int) {
        self.id = id;
        self.money = 0;
    }

    get fun money(): Int {
        return self.money;
    }

    receive(msg: GetMoney) {
        require(msg.amount >= 50, "We need more money!");
        
        self.money += msg.amount;
    }
}
