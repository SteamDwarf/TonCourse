message SetTask {
    task: String;
}

message CreateTodo {
    task: String;
}

message GetTodo {
    seqno: Int;
}

message CreateTodoResponse {
    seqno: Int;
}

struct TodoInfo {
    seqno: Int;
    task: String;
    isCompleted: Bool;
}