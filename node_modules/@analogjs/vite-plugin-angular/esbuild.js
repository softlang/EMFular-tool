import analog from '@analogjs/vite-plugin-angular';
export const analogSFC = (options) => ({
    name: 'analog-sfc-esbuild-plugin',
    async setup(build) {
        const analogPlugins = analog({
            ...(options || {}),
            experimental: {
                supportAnalogFormat: true,
                ...(options?.experimental || {}),
            },
        });
        const analogPlugin = analogPlugins[0];
        await analogPlugin.config({ root: '.' }, { command: 'build' });
        await analogPlugin.buildStart?.({
            plugins: [
                {
                    name: 'vite:css',
                    transform(code) {
                        return { code };
                    },
                },
            ],
        });
        build.onLoad({ filter: /\.(analog|ag)$/ }, async (args) => {
            await analogPlugin.handleHotUpdate?.({ file: args.path, modules: [] });
            const result = await analogPlugin.transform?.('', args.path);
            return { loader: 'js', contents: result?.code };
        });
    },
});
//# sourceMappingURL=esbuild.js.map