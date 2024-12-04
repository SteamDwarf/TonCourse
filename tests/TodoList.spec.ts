import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { fromNano, toNano } from '@ton/core';
import { TodoList } from '../wrappers/TodoList';
import '@ton/test-utils';
import { Todo } from '../wrappers/Todo';

describe('TodoList', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let todoList: SandboxContract<TodoList>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        todoList = blockchain.openContract(await TodoList.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await todoList.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: todoList.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and todoList are ready to use
    });

    it('should create todo', async () => {
        const todosCountBeforeCreating = await todoList.getTodosCount();
        expect(todosCountBeforeCreating).toEqual(0n);
        
        const response = await todoList.send(
            deployer.getSender(),
            {
                value: toNano("1")
            },
            {
                $$type: 'CreateTodo',
                task: 'Buy bread'
            }
        );
        
        console.log(response.events);
        expect(await todoList.getTodosCount()).toEqual(1n);

        const todoAddress = await todoList.getTodoAddress(1n);
        expect(todoAddress).not.toBe(null);

        const todo = blockchain.openContract(Todo.fromAddress(todoAddress));
        expect(todo).not.toBe(null);

        const todoInfo = await todo.getInfo();
        expect(todoInfo.task).toEqual('Buy bread');
    })
});
