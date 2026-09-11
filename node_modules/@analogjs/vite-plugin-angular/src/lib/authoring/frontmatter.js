export async function getFrontmatterMetadata(content, id, transforms) {
    const fm = await import('front-matter');
    // The `default` property will be available in CommonJS environment, for instance,
    // when running unit tests. It's safe to retrieve `default` first, since we still
    // fallback to the original implementation.
    const frontmatterFn = fm.default || fm;
    let vfile = {};
    for (const transform of transforms) {
        const result = await transform(content, id);
        vfile = typeof result === 'object' ? result : vfile;
    }
    const safeVFile = {
        path: vfile.path,
        data: vfile.data,
        messages: vfile.messages,
        history: vfile.history,
        cwd: vfile.cwd,
    };
    const { attributes } = frontmatterFn(content);
    const combinedMetadata = {
        ...attributes,
        vfile: safeVFile,
    };
    return `\n\nexport const metadata = ${JSON.stringify(combinedMetadata)}`;
}
//# sourceMappingURL=frontmatter.js.map