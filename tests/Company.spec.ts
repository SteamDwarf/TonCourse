import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Company } from '../wrappers/Company';
import '@ton/test-utils';
import { Fund } from '../wrappers/Fund';

describe('Company', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let company: SandboxContract<Company>;
    let fund: SandboxContract<Fund>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        company = blockchain.openContract(await Company.fromInit(123n));
        fund = blockchain.openContract(await Fund.fromInit(123n));

        deployer = await blockchain.treasury('deployer');

        const deployCompanyResult = await company.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployCompanyResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: company.address,
            deploy: true,
            success: true,
        });

        const deployFundResult = await fund.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployFundResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fund.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and company are ready to use
    });

    it('Company should get money', async () => {
        const moneyToSend = 60n;

        const fundBeforeMoney = await fund.getMoney();
        const companyBeforeMoney = await company.getMoney();

        expect(fundBeforeMoney).toEqual(100n);
        expect(companyBeforeMoney).toEqual(0n);

        await fund.send(
            deployer.getSender(),
            {
                value: toNano('0.02')
            },
            {
                $$type: 'GiveMoney',
                address: company.address,
                amount: moneyToSend
            }
        )

        const fundAfterMoney = await fund.getMoney();
        const companyAfterMoney = await company.getMoney();

        expect(fundAfterMoney).toEqual(fundBeforeMoney - moneyToSend);
        expect(companyAfterMoney).toEqual(companyBeforeMoney + moneyToSend);
    });

    it('Company don`t accept small amount of money', async () => {
        const moneyToSend = 10n;

        const fundBeforeMoney = await fund.getMoney();
        const companyBeforeMoney = await company.getMoney();

        expect(fundBeforeMoney).toEqual(100n);
        expect(companyBeforeMoney).toEqual(0n);

        await fund.send(
            deployer.getSender(),
            {
                value: toNano('0.02')
            },
            {
                $$type: 'GiveMoney',
                address: company.address,
                amount: moneyToSend
            }
        )

        const fundAfterMoney = await fund.getMoney();
        const companyAfterMoney = await company.getMoney();

        expect(fundAfterMoney).toEqual(fundBeforeMoney);
        expect(companyAfterMoney).toEqual(companyBeforeMoney);
    })
});
