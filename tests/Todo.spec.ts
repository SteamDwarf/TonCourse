import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Todo } from '../wrappers/Todo';
import '@ton/test-utils';

describe('Todo', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let todo: SandboxContract<Todo>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        todo = blockchain.openContract(await Todo.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await todo.send(
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
            to: todo.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and todo are ready to use
    });
});
