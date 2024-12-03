import { NetworkProvider } from '@ton/blueprint';
import { Counter } from '../wrappers/Counter';

export async function run(provider: NetworkProvider) {
    const counterContract = provider.open(await Counter.fromInit(123n));
    const counter = await counterContract.getCounter();
    const id = await counterContract.getId();

    console.log('Counter ', id, 'has count', counter);
}