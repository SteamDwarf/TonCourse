import { toNano } from '@ton/core';
import { Index } from '../wrappers/Index';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const index = provider.open(await Index.fromInit());

    await index.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(index.address);

    // run methods on `index`
}
