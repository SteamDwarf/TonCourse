import { Address, toNano } from '@ton/core';
import { NftItem } from '../wrappers/NftItem';
import { NetworkProvider } from '@ton/blueprint';
import { NftCollection } from '../wrappers/NftCollection';
import { createOffchainContent } from './helpers';

export async function run(provider: NetworkProvider) {
    const ownerAddress = provider.sender().address;

    if(!ownerAddress) return;

    const nftCollection = provider.open(NftCollection.fromAddress(Address.parse('EQBoCTxoihjYAQaNEyEf3IFDRIqbAd07OpRfb3vdxxrh28uV')));
    const nftContent = createOffchainContent('https://steamdwarf.github.io/TonVillageClickerAssets/nft/metadata/0.json');

    await nftCollection.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'NftDeploy',
            query_id: 0n,
            index: 0n,
            owner: ownerAddress,
            content: nftContent,
            response_address: ownerAddress
        }
    );

    // run methods on `nftItem`
}
