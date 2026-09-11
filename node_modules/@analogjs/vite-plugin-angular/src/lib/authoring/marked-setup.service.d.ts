/**
 * Credit goes to Scully for original implementation
 * https://github.com/scullyio/scully/blob/main/libs/scully/src/lib/fileHanderPlugins/markdown.ts
 */
import { marked } from 'marked';
import 'prismjs';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js';
import 'prismjs/plugins/toolbar/prism-toolbar.js';
export declare class MarkedSetupService {
    private readonly marked;
    constructor();
    escapeBreakingCharacters(code: string): string;
    detectAngularComponent(text: string): boolean;
    detectAngularControlFlow(text: string): boolean;
    decodeHtmlEntities(text: string): string;
    getMarkedInstance(): typeof marked;
}
