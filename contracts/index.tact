import "@stdlib/deploy";

message Reach {
    counter: Address;
    value: Int as uint32;
}

message Increment {
    amount: Int as uint32;
}

message CounterValue {
    value: Int as uint32;
}

contract Index with Deployable {
    reach: Int as uint32;

    init() {
        self.reach = 0
    }

    receive(msg: Reach) {
        //Позволяет выполнить проверку и выбросить ошибку если не выполнилось условие
        //require(msg.value <= 10, "value can`t be more than 10");

        //Второй способ проверить условие и выбросить ошабку если оно не выолняется
        /* if(msg.value > 10) {
            throw(304);
        }
 */
        self.reach = msg.value;
        send(SendParameters{
            to: msg.counter, 
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: "get_counter".asComment()
        });
    }

    receive(msg: CounterValue) {
        if(self.reach > msg.value) {
            send(SendParameters{
                to: sender(), 
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: Increment{amount: self.reach}.toCell()
            });
        }
    }
}
