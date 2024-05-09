/**
 * @param {import('cheerio').CheerioAPI} $ The cheerio selector.
 * @param {import('cheerio').Cheerio<import('cheerio').Element>} element The DOM element.
 * @param {string} attribute The element attribute to load.
 * @param {import('./index.js').BuildOptions} options Build options.
 * @param {import('./index.js').Helpers} helpers Helpers.
 * @returns {Promise<import('@chialab/esbuild-rna').OnTransformResult|void>} Plain build.
 */
export function collectAsset($: import('cheerio').CheerioAPI, element: import('cheerio').Cheerio<import('cheerio').Element>, attribute: string, options: import('./index.js').BuildOptions, helpers: import('./index.js').Helpers): Promise<import('@chialab/esbuild-rna').OnTransformResult | void>;
export function collectAssets($: import("cheerio").CheerioAPI, dom: import("cheerio").Cheerio<import("cheerio").Document>, options: import("./index.js").BuildOptions, helpers: import("./index.js").Helpers): Promise<import("@chialab/esbuild-rna").OnTransformResult[]>;
