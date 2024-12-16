import { toNano } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import { NetworkProvider } from '@ton/blueprint';
import { createOffchainContent } from './helpers';

export async function run(provider: NetworkProvider) {
    const ownerAddress = provider.sender().address;
    if(!ownerAddress) return;

    const content = createOffchainContent('https://raw.githubusercontent.com/SteamDwarf/TonVillageClickerAssets/refs/heads/main/nft/metadata/collection.json');
    const nftCollection = provider.open(await NftCollection.fromInit(
        ownerAddress,
        content
    ));

    await nftCollection.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(nftCollection.address);

    // run methods on `nftCollection`
}
