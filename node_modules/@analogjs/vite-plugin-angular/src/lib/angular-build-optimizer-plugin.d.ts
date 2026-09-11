import { Plugin } from 'vite';
export declare function buildOptimizerPlugin({ jit, }: {
    supportedBrowsers: string[];
    jit: boolean;
}): Plugin;
