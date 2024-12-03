import { toNano } from '@ton/core';
import { Creator } from '../wrappers/Creator';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const creator = provider.open(await Creator.fromInit());

    await creator.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(creator.address);

    // run methods on `creator`
}
