import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/inheritance.tact',
    options: {
        debug: true,
    },
};
