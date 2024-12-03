import "@stdlib/deploy";

message Increment {
    amount: Int as uint32;
}

message CounterValue {
    value: Int as uint32;
}

contract Counter with Deployable {
    id: Int as uint32;
    counter: Int as uint32;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
    }

    get fun counter():Int {
        return self.counter;
    }

    get fun id():Int {
        return self.id;
    }

    receive("get_counter") {
        self.reply(CounterValue{value: self.counter}.toCell());
    }

    receive(msg: Increment) {
        self.counter = self.counter + msg.amount;
    }

    receive("increment") {
        self.counter = self.counter + 1;
    }
}
