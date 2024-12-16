import { Blockchain, EventAccountCreated, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { JettonMarket } from '../wrappers/JettonMarket';
import '@ton/test-utils';
import { buildOnchainMetadata } from '../scripts/buildData';
import tokenMeta from '../assets/token_data.json';
import { JettonMaster } from '../wrappers/JettonMaster';
import { JettonWallet } from '../wrappers/JettonWallet';

describe('JettonMarket', () => {
    const jettonPrice = toNano('0.001');
    const jettonContent = buildOnchainMetadata(tokenMeta);
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let jettonMarket: SandboxContract<JettonMarket>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        jettonMarket = blockchain.openContract(await JettonMarket.fromInit(jettonPrice, jettonContent));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await jettonMarket.send(
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
            to: jettonMarket.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonMarket are ready to use
    });

    it("buy tokkens", async () => {
        const amount = 100n;

        /* const response = await jettonMarket.send(
            deployer.getSender(),
            {
                value: amount * jettonPrice + toNano('0.15')
            },
            {
                $$type: 'Buy',
                query_id: 0n,
                amount: amount,
            }
        ); */


        const jettonMaster = blockchain.openContract(await JettonMaster.fromInit(jettonMarket.address, jettonContent));
        console.log(jettonMaster);
        expect((await jettonMaster.getGetJettonData()).total_supply).toBe(100n);

        const jettonWallet = blockchain.openContract(await JettonWallet.fromInit(deployer.address, jettonMaster.address));
        expect((await jettonWallet.getGetWalletData()).balance).toBe(100n);


        /* const jettonMaster = blockchain.openContract(await JettonMaster.fromInit(jettonMarket.address, jettonContent));
        console.log(await jettonMaster.getGetJettonData()); */
    })

    it("get wallet address", async () => {
        const amount = 100n;

        const response = await jettonMarket.send(
            deployer.getSender(),
            {
                value: amount * jettonPrice + toNano('0.15')
            },
            {
                $$type: 'Buy',
                query_id: 0n,
                amount: amount,
            }
        );

        expect(response.events.at(-2)?.type).toBe('account_created');

        const walletAddress = (await jettonMarket.getGetJettonWalletAddress(deployer.getSender().address)).toString()
        expect((response.events.at(-2) as EventAccountCreated)?.account.toString()).toBe(walletAddress);
    })
});
