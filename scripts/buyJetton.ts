import { toNano } from '@ton/core';
import { JettonMarket } from '../wrappers/JettonMarket';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './buildData';
import tokenMeta from '../assets/token_data.json';

export async function run(provider: NetworkProvider) {
    const jettonPrice = toNano('0.001');
    const jettonContent = buildOnchainMetadata(tokenMeta);
    const jettonMarket = provider.open(await JettonMarket.fromInit(jettonPrice, jettonContent));
    const amount = 300n;
    const sum = amount * jettonPrice + toNano('0.15');

    await jettonMarket.send(
        provider.sender(),
        {
            value: sum,
        },
        {
            $$type: 'Buy',
            query_id: 0n,
            amount: amount
        }
    );

    await provider.waitForDeploy(jettonMarket.address);

    // run methods on `jettonMarket`
}
