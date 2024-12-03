import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import '@ton/test-utils';

describe('Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counter = blockchain.openContract(await Counter.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.send(
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
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and counter are ready to use
    });

    it('should increment by 1', async () => {
        const counterBefore = await counter.getCounter();

        await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'increment'
        );

        const counterAfter = await counter.getCounter();

        expect(counterAfter).toEqual(counterBefore + 1n);
    })

    it('should increment by amount', async () => {
        const counterBefore = await counter.getCounter();

        const deployResult = await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Increment',
                amount: 5n
            }
        );

        const counterAfter = await counter.getCounter();

        expect(counterAfter).toEqual(counterBefore + 5n);
    })
});
