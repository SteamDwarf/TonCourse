import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import '@ton/test-utils';
import { Index } from '../wrappers/Index';

describe('Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Counter>;
    let index: SandboxContract<Index>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counter = blockchain.openContract(await Counter.fromInit(0n));
        index = blockchain.openContract(await Index.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployCounterResult = await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployCounterResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });

        const deployIndexResult = await index.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployIndexResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: index.address,
            deploy: true,
            success: true,
        });

    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and counter are ready to use
    });

    it('counter should reach value', async () => {
        const reach = BigInt(1);
        const counterBefore = await counter.getCounter();

        expect(counterBefore).toEqual(0n);

        const resp = await index.send(
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            {
                $$type: 'Reach',
                value: reach,
                counter: counter.address
            }
        );

        const counterAfter = await counter.getCounter();
        expect(counterAfter).toEqual(reach);

    })

    /* it('should increment by 1', async () => {
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
    }) */
});
