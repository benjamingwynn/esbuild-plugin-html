/// <reference types="node" />
/**
 * @param {import('cheerio').CheerioAPI} $ The cheerio selector.
 * @param {import('cheerio').Cheerio<import('cheerio').Element>} element The DOM element.
 * @param {Icon} icon The generated icon file.
 * @param {string} rel Rel attribute.
 * @param {boolean} shortcut Should include shortcut.
 * @param {import('./index.js').BuildOptions} options Build options.
 * @param {import('./index.js').Helpers} helpers Helpers.
 * @returns {Promise<import('@chialab/esbuild-rna').OnTransformResult>} Plain build.
 */
export function collectIcon($: import('cheerio').CheerioAPI, element: import('cheerio').Cheerio<import('cheerio').Element>, icon: Icon, rel: string, shortcut: boolean, options: import('./index.js').BuildOptions, helpers: import('./index.js').Helpers): Promise<import('@chialab/esbuild-rna').OnTransformResult>;
export function collectIcons($: import("cheerio").CheerioAPI, dom: import("cheerio").Cheerio<import("cheerio").Document>, options: import("./index.js").BuildOptions, helpers: import("./index.js").Helpers): Promise<import("@chialab/esbuild-rna").OnTransformResult[]>;
export type Icon = {
    /**
     * The icon name.
     */
    name: string;
    /**
     * The icon size.
     */
    size: number;
    /**
     * The icon buffer.
     */
    contents: Buffer;
    /**
     * The icon gutter.
     */
    gutter?: number | undefined;
    /**
     * The icon background.
     */
    background?: {
        r: number;
        g: number;
        b: number;
        a: number;
    } | undefined;
};
import { Buffer } from 'buffer';
