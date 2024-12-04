import { toNano } from '@ton/core';
import { TodoList } from '../wrappers/TodoList';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const todoList = provider.open(await TodoList.fromInit());

    await todoList.send(
        provider.sender(), 
        {
            value: toNano('0.07')
        }, 
        {
            $$type: 'CreateTodo',
            task: 'Buy bread'
        }
    )

    // run methods on `todoList`
}
