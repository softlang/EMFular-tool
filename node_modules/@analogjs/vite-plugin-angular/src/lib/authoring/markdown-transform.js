import { FRONTMATTER_REGEX } from './constants.js';
let markedSetupServicePromise;
export const defaultMarkdownTemplateTransform = async (content) => {
    if (!markedSetupServicePromise) {
        // set immediately to prevent other calls from seeing markedSetupServicePromise as
        // undefined - can't use await here
        markedSetupServicePromise = import('./marked-setup.service.js').then(({ MarkedSetupService }) => new MarkedSetupService());
    }
    // read template sections, parse markdown
    const markedSetupService = await markedSetupServicePromise;
    const mdContent = markedSetupService
        .getMarkedInstance()
        .parse(content.replace(FRONTMATTER_REGEX, ''));
    return mdContent;
};
export const defaultMarkdownTemplateTransforms = [
    defaultMarkdownTemplateTransform,
];
//# sourceMappingURL=markdown-transform.js.map