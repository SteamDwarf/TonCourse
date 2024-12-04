import "@stdlib/deploy";
import "@stdlib/ownable";
import "./todo.tact";
import "./todoMessages.tact";

contract TodoList with Deployable, Ownable {
    owner: Address;
    todosCount: Int as uint32;

    init() {
        self.owner = sender();
        self.todosCount = 0;
    }

    receive(msg: CreateTodo) {
        self.requireOwner();

        self.todosCount += 1;

        let initTodo = initOf Todo(self.todosCount, myAddress());
        let todoAddress = contractAddress(initTodo);

        send(SendParameters{
            to: todoAddress, 
            value: ton("0.05"),
            mode: SendIgnoreErrors,
            code: initTodo.code,
            data: initTodo.data,
            body: SetTask{task: msg.task}.toCell()
        });

        self.reply("Todo has created".asComment());
    }

    get fun todosCount(): Int {
        return self.todosCount;
    }

    get fun todoAddress(seqno: Int): Address {
        require(seqno <= self.todosCount(), "No Todo");

        let initTodo = initOf Todo(seqno, myAddress());
        return contractAddress(initTodo);
    }
}
