import { toNano } from '@ton/core';
import { Todo } from '../wrappers/Todo';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const todo = provider.open(await Todo.fromInit());

    await todo.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(todo.address);

    // run methods on `todo`
}
