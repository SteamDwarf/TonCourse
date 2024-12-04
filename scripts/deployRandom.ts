import { toNano } from '@ton/core';
import { Random } from '../wrappers/Random';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const random = provider.open(await Random.fromInit());

    await random.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(random.address);

    // run methods on `random`
}
