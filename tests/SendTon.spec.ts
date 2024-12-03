import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { SendTon } from '../wrappers/SendTon';
import '@ton/test-utils';

describe('SendTon', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sendTon: SandboxContract<SendTon>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        sendTon = blockchain.openContract(await SendTon.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await sendTon.send(
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
            to: sendTon.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sendTon are ready to use
    });

    it('Send Ton can get coins', async () => {
        const initBalance = await sendTon.getBalance();
        expect(initBalance).toEqual('0');
        
        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano(500)
            },
            null
        )
        
        const currentBalance = await sendTon.getBalance();
        expect(Number(currentBalance)).toBeGreaterThan(0);
    });

    it('Can withdraw all', async () => {
        const balanceBeforeSending = await deployer.getBalance();
        const sendCoinAmount = toNano(500);

        await sendTon.send(
            deployer.getSender(),
            {
                value: sendCoinAmount
            },
            null
        )

        const balanceAfterSending = await deployer.getBalance();
        expect(balanceAfterSending).toBeLessThan(balanceBeforeSending - sendCoinAmount);

        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.01')
            },
            'withdraw all'
        );

        const balanceAfterWithdraw = await deployer.getBalance();
        expect(balanceAfterWithdraw).toBeGreaterThan(balanceAfterSending);
    });

    it('another user can`t withdraw all', async () => {
        const sendCoinAmount2 = toNano(500);

        await sendTon.send(
            deployer.getSender(),
            {
                value: sendCoinAmount2
            },
            null
        )

        const balanceBeforeWithdraw = Number(await sendTon.getBalance());
        expect(balanceBeforeWithdraw).toBeGreaterThan(0);

        const user = await blockchain.treasury('user');

        await sendTon.send(
            user.getSender(),
            {
                value: toNano('0.01')
            },
            'withdraw all'
        );

        const balanceAfterWithdraw = Number(await sendTon.getBalance());
        expect(balanceAfterWithdraw).toEqual(balanceBeforeWithdraw);
    })

    it('Test withdraw safe', async () => {
        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano(200)
            },
            null
        )

        expect(Number(await sendTon.getBalance())).toBeGreaterThan(0);

        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.01')
            },
            'withdraw safe'
        );

        expect(await sendTon.getBalance()).toEqual('0.01');
    }),

    it('Withdraw amount ton', async () => {
        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano(200)
            },
            null
        )

        const beforeWithdraw = Number(await sendTon.getBalance());
        expect(beforeWithdraw).toBeGreaterThan(0);

        await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.01')
            },
            {
                $$type: 'GetTons',
                amount: toNano(100)
            }
        );

        expect(Number(await sendTon.getBalance())).toBeLessThan(beforeWithdraw);

        const resp = await sendTon.send(
            deployer.getSender(),
            {
                value: toNano('0.01')
            },
            {
                $$type: 'GetTons',
                amount: toNano(100)
            }
        );

        console.log(resp.events);
        console.log(Number(await sendTon.getBalance()))

        expect(Number(await sendTon.getBalance())).toBeGreaterThan(0);
        //expect(Number(await sendTon.getBalance())).toBeGreaterThan(0);
    })
});
