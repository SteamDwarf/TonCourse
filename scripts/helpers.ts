import { beginCell } from "@ton/core"

export const createOffchainContent = (link: string) => {
    return beginCell().storeUint(1, 8).storeStringTail(link).endCell();
}