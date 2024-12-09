import { toNano } from '@ton/core';
import { JettonMaster } from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const providerAddress = provider.sender().address;
    
    if(!providerAddress) return;

    const jettonMaster = provider.open(await JettonMaster.create(providerAddress));

    await jettonMaster.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(jettonMaster.address);

    // run methods on `jettonMaster`
}
