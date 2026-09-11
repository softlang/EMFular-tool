/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { JavaScriptTransformer, } from './utils/devkit.js';
export function createCompilerPlugin(pluginOptions, isTest, closeTransformer) {
    const javascriptTransformer = new JavaScriptTransformer({ ...pluginOptions, jit: true }, 1);
    return {
        name: 'analogjs-angular-esbuild-deps-optimizer-plugin',
        async setup(build) {
            if (!isTest) {
                build.onLoad({ filter: /\.[cm]?js$/ }, async (args) => {
                    const contents = await javascriptTransformer.transformFile(args.path);
                    return {
                        contents,
                        loader: 'js',
                    };
                });
            }
            if (closeTransformer) {
                build.onEnd(() => javascriptTransformer.close());
            }
        },
    };
}
//# sourceMappingURL=compiler-plugin.js.map