import { type VFile } from 'vfile';
export type MarkdownTemplateTransform = (content: string, fileName: string) => string | Promise<string> | Promise<VFile>;
export declare const defaultMarkdownTemplateTransform: MarkdownTemplateTransform;
export declare const defaultMarkdownTemplateTransforms: MarkdownTemplateTransform[];
