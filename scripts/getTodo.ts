import { toNano } from '@ton/core';
import { TodoList } from '../wrappers/TodoList';
import { NetworkProvider } from '@ton/blueprint';
import { Todo } from '../wrappers/Todo';

export async function run(provider: NetworkProvider) {
    const todoList = provider.open(await TodoList.fromInit());
    const todoAddress = await todoList.getTodoAddress(1n);
    const todosCount = await todoList.getTodosCount();
    const todo = provider.open(Todo.fromAddress(todoAddress));
    const todoInfo = await todo.getInfo();

    console.log(todoAddress);
    console.log(todosCount);
    console.log(todo);
    console.log(todoInfo);
    // run methods on `todoList`
}
