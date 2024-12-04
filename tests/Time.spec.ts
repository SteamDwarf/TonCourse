import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Time } from '../wrappers/Time';
import '@ton/test-utils';

describe('Time', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let time: SandboxContract<Time>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        time = blockchain.openContract(await Time.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await time.send(
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
            to: time.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and time are ready to use
    });
});
