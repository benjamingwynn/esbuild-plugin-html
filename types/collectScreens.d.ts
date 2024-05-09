/// <reference types="node" />
/**
 * @param {import('cheerio').CheerioAPI} $ The cheerio selector.
 * @param {import('cheerio').Cheerio<import('cheerio').Element>} element The DOM element.
 * @param {Screen} screen The generated screen file.
 * @param {import('./index.js').BuildOptions} options Build options.
 * @param {import('./index.js').Helpers} helpers Helpers.
 * @returns {Promise<import('@chialab/esbuild-rna').OnTransformResult>} Plain build.
 */
export function collectScreen($: import('cheerio').CheerioAPI, element: import('cheerio').Cheerio<import('cheerio').Element>, screen: Screen, options: import('./index.js').BuildOptions, helpers: import('./index.js').Helpers): Promise<import('@chialab/esbuild-rna').OnTransformResult>;
export function collectScreens($: import("cheerio").CheerioAPI, dom: import("cheerio").Cheerio<import("cheerio").Document>, options: import("./index.js").BuildOptions, helpers: import("./index.js").Helpers): Promise<import("@chialab/esbuild-rna").OnTransformResult[]>;
export type Screen = {
    /**
     * The screen name.
     */
    name: string;
    /**
     * The icon buffer.
     */
    contents: Buffer;
    /**
     * The screen width.
     */
    width: number;
    /**
     * The screen height.
     */
    height: number;
    /**
     * The screen media query.
     */
    query: string;
};
import { Buffer } from 'buffer';
