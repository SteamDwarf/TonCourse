import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Random } from '../wrappers/Random';
import '@ton/test-utils';

describe('Random', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let random: SandboxContract<Random>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        random = blockchain.openContract(await Random.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await random.send(
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
            to: random.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and random are ready to use
    });
});
