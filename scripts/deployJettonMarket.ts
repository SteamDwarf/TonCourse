import { toNano } from '@ton/core';
import { JettonMarket } from '../wrappers/JettonMarket';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './buildData';
import tokenMeta from '../assets/token_data.json';

export async function run(provider: NetworkProvider) {
    const jettonPrice = toNano('0.001');
    const jettonContent = buildOnchainMetadata(tokenMeta);
    const jettonMarket = provider.open(await JettonMarket.fromInit(jettonPrice, jettonContent));

    await jettonMarket.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(jettonMarket.address);

    // run methods on `jettonMarket`
}
