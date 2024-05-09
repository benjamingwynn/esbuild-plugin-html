export function collectScripts($: import("cheerio").CheerioAPI, dom: import("cheerio").Cheerio<import("cheerio").Document>, options: import("./index.js").CollectOptions<{
    injectStylesAs: 'script' | 'link';
}>, helpers: import("./index.js").Helpers): Promise<import("@chialab/esbuild-rna").OnTransformResult[]>;
