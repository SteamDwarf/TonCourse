import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Inheritance } from '../wrappers/Inheritance';
import '@ton/test-utils';

describe('Inheritance', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let inheritance: SandboxContract<Inheritance>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        inheritance = blockchain.openContract(await Inheritance.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await inheritance.send(
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
            to: inheritance.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and inheritance are ready to use
    });
});
