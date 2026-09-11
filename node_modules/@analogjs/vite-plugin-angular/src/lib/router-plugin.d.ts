export declare function routerPlugin(): {
    name: string;
    enforce: string;
    transform(_code: string, id: string): Promise<{
        code: string;
    } | undefined>;
};
