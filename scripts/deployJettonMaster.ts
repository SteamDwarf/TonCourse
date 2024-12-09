import { toNano } from '@ton/core';
import { JettonMaster } from '../wrappers/JettonMaster';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './buildData';
import tokenMeta from '../assets/token_data.json';

export async function run(provider: NetworkProvider) {
    const jettonContent = buildOnchainMetadata(tokenMeta);
    const adminAddress = provider.sender().address;

    if(!adminAddress) return;

    const jettonMaster = provider.open(await JettonMaster.fromInit(adminAddress, jettonContent));

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
