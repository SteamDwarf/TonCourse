import { Address, beginCell, toNano } from '@ton/core';
import { JettonMaster } from '../wrappers/JettonMaster';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './buildData';
import tokenMeta from '../assets/token_data.json';
import { JettonWallet } from '../wrappers/JettonWallet';

export async function run(provider: NetworkProvider) {
    const adminAddress = provider.sender().address;
    const jettonContent = buildOnchainMetadata(tokenMeta);
    if(!adminAddress) return;

    const jettonMaster = provider.open(await JettonMaster.fromInit(adminAddress, jettonContent));
    const jettonWallet = provider.open(await JettonWallet.fromInit(adminAddress, jettonMaster.address));

    const response = await jettonWallet.send(
        provider.sender(),
        {
            value: toNano('0.5')
        },
        {
            $$type: 'Burn',
            query_id: 0n,
            amount: 43n,
            response_destination: adminAddress,
            custom_payload: beginCell().endCell(),
        }
    )
}
