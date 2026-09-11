import * as ts from 'typescript';
import { MarkdownTemplateTransform } from './authoring/markdown-transform.js';
export declare function augmentHostWithResources(host: ts.CompilerHost, transform: (code: string, id: string, options?: {
    ssr?: boolean;
}) => ReturnType<any> | null, options: {
    inlineStylesExtension: string;
    supportAnalogFormat?: boolean | {
        include: string[];
    };
    isProd?: boolean;
    markdownTemplateTransforms?: MarkdownTemplateTransform[];
    inlineComponentStyles?: Map<string, string>;
    externalComponentStyles?: Map<string, string>;
}): void;
export declare function augmentProgramWithVersioning(program: ts.Program): void;
export declare function augmentHostWithCaching(host: ts.CompilerHost, cache: Map<string, ts.SourceFile>): void;
export declare function mergeTransformers(first: ts.CustomTransformers, second: ts.CustomTransformers): ts.CustomTransformers;
