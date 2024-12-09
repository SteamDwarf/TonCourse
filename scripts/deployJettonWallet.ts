import { toNano } from '@ton/core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const senderAddress = provider.sender().address;
    if(!senderAddress) return;

    const jettonWallet = provider.open(await JettonWallet.fromInit(
        senderAddress,
        senderAddress
    ));

    await jettonWallet.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(jettonWallet.address);

    // run methods on `jettonWallet`
}
