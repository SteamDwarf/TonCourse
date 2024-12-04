import { toNano } from '@ton/core';
import { Inheritance } from '../wrappers/Inheritance';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const inheritance = provider.open(await Inheritance.fromInit());

    await inheritance.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(inheritance.address);

    // run methods on `inheritance`
}
