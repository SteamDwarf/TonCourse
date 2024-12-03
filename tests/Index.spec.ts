import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Index } from '../wrappers/Index';
import '@ton/test-utils';

describe('Index', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let index: SandboxContract<Index>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        index = blockchain.openContract(await Index.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await index.send(
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
            to: index.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and index are ready to use
    });
});
