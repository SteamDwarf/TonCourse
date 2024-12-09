import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, toNano } from '@ton/core';
import { JettonMaster } from '../wrappers/JettonMaster';
import '@ton/test-utils';
import { buildOnchainMetadata } from '../scripts/buildData';
import tokenMeta from '../assets/token_data.json';
import { JettonWallet } from '../wrappers/JettonWallet';


describe('JettonMaster', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let jettonMaster: SandboxContract<JettonMaster>;
    const jettonContent = buildOnchainMetadata(tokenMeta);
    
    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        jettonMaster = blockchain.openContract(await JettonMaster.fromInit(deployer.address, jettonContent));


        const deployResult = await jettonMaster.send(
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
            to: jettonMaster.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonMaster are ready to use
    });

    it("Jetton minting", async () => {
        const response = await jettonMaster.send(
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            {
                $$type: 'Transfer',
                query_id: 0n,
                amount: 3n,
                reciever: deployer.address,
                response_destination: deployer.address,
                forward_ton_amount: 0n,
                custom_payload: beginCell().endCell(),
                forward_payload: beginCell().endCell()
            }
        );

        expect((await jettonMaster.getGetJettonData()).total_supply).toBe(3n);

        const jettonWallet = blockchain.openContract(await JettonWallet.fromInit(deployer.address, jettonMaster.address));
        expect((await jettonWallet.getGetWalletData()).balance).toBe(3n);
    })

    it('burn jettons', async () => {
        await jettonMaster.send(
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            {
                $$type: 'Transfer',
                query_id: 0n,
                amount: 3n,
                reciever: deployer.address,
                response_destination: deployer.address,
                forward_ton_amount: 0n,
                custom_payload: beginCell().endCell(),
                forward_payload: beginCell().endCell()
            }
        );

        const jettonWallet = blockchain.openContract(await JettonWallet.fromInit(deployer.address, jettonMaster.address));

        expect((await jettonWallet.getGetWalletData()).balance).toBe(3n);
        expect((await jettonMaster.getGetJettonData()).total_supply).toBe(3n);

        const response = await jettonWallet.send(
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            {
                $$type: 'Burn',
                query_id: 0n,
                amount: 3n,
                response_destination: deployer.address,
                custom_payload: beginCell().endCell(),
            }
        );


        expect((await jettonWallet.getGetWalletData()).balance).toBe(0n);
        expect((await jettonMaster.getGetJettonData()).total_supply).toBe(0n);
    })

    it("transfer", async () => {
        const user = await blockchain.treasury('user');
        const adminWallet = blockchain.openContract(await JettonWallet.fromInit(deployer.address, jettonMaster.address));
        
        await jettonMaster.send(
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            {
                $$type: 'Transfer',
                query_id: 0n,
                amount: 100n,
                reciever: deployer.address,
                response_destination: deployer.address,
                forward_ton_amount: 0n,
                custom_payload: beginCell().endCell(),
                forward_payload: beginCell().endCell()
            }
        );

        expect((await adminWallet.getGetWalletData()).balance).toBe(100n);
        
        await adminWallet.send(
            deployer.getSender(),
            {
                value: toNano('0.5')
            },
            {
                $$type: 'Transfer',
                query_id: 0n,
                amount: 20n,
                reciever: user.address,
                response_destination: deployer.address,
                forward_ton_amount: 0n,
                custom_payload: beginCell().endCell(),
                forward_payload: beginCell().endCell()
            }
        );

        const userWallet = blockchain.openContract(await JettonWallet.fromInit(user.address, jettonMaster.address));

        expect((await adminWallet.getGetWalletData()).balance).toBe(80n);
        expect((await userWallet.getGetWalletData()).balance).toBe(20n);
    })
});
