import "@stdlib/deploy";
import "./todoMessages.tact";

contract Todo with Deployable {
    seqno: Int as uint32;
    todoList: Address;
    task: String;
    isCompleted: Bool;

    init(seqno: Int, todoList: Address) {
        self.seqno = seqno;
        self.todoList = todoList;
        self.task = "";
        self.isCompleted = false;
    }

    receive(msg: SetTask) {
        require(self.todoList == sender(), "You don`t have permission");
        self.task = msg.task;
        self.reply("todo_created".asComment());
    }

    receive("complete") {
        require(self.todoList == sender(), "You don`t have permission");
        self.isCompleted = true;
    }

    get fun info(): TodoInfo {
        return TodoInfo{
            seqno: self.seqno, 
            task:  self.task, 
            isCompleted: self.isCompleted
        }
    }
}
