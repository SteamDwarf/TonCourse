import { NetworkProvider } from '@ton/blueprint';
import { Counter } from '../wrappers/Counter';
import { toNano } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const counterContract = provider.open(await Counter.fromInit(123n));
    await counterContract.send(
        provider.sender(), 
        {
            value: toNano('0.05')
        }, 
        {
            $$type: 'Increment',
            amount: 5n
        }
    )
}