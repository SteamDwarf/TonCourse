import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Creator } from '../wrappers/Creator';
import '@ton/test-utils';
import { Store } from '../build/Creator/tact_Store';

describe('Creator', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let creator: SandboxContract<Creator>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        creator = blockchain.openContract(await Creator.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await creator.send(
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
            to: creator.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and creator are ready to use
    });

    it('Should create store', async () => {
        const store = blockchain.openContract(await Store.fromInit(1n));
        
        await creator.send(
            deployer.getSender(),
            {
                value: toNano('0.02')
            },
            {
                $$type: 'CreateStore',
                id: 1n
            }
        )

        expect(await store.getId()).toBe(1n);
    })
});
