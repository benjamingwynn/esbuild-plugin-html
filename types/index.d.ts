/// <reference types="node" />
/**
 * @typedef {Object} PluginOptions
 * @property {string} [scriptsTarget]
 * @property {string|string[]} [modulesTarget]
 * @property {string} [entryNames]
 * @property {string} [chunkNames]
 * @property {string} [assetNames]
 * @property {'link' | 'script'} [injectStylesAs]
 * @property {import('htmlnano').HtmlnanoOptions} [minifyOptions]
 */
/**
 * @typedef {Object} BuildOptions
 * @property {string} sourceDir
 * @property {string} outDir
 * @property {string} entryDir
 * @property {string} workingDir
 * @property {(string | string[])[]} target
 */
/**
 * @typedef {BuildOptions & T} CollectOptions
 * @template {object} T
 */
/**
 * @typedef {Object} Helpers
 * @property {(ext: string, suggestion?: string) => string} createEntry
 * @property {(filePath: string, buffer?: Buffer) => string} resolveAssetFile
 * @property {(path: string, contents?: string|Buffer) => Promise<import('@chialab/esbuild-rna').File>} emitFile
 * @property {(options: import('@chialab/esbuild-rna').EmitChunkOptions) => Promise<import('@chialab/esbuild-rna').Chunk>} emitChunk
 * @property {(options: import('@chialab/esbuild-rna').EmitBuildOptions) => Promise<import('@chialab/esbuild-rna').Result>} emitBuild
 * @property {(file: string) => Promise<import('esbuild').OnResolveResult>} resolve
 * @property {(filePath: string, from?: string|null, prefix?: string) => string} resolveRelativePath
 * @property {(file: string, options: Partial<import('esbuild').OnLoadArgs>) => Promise<import('esbuild').OnLoadResult | undefined>} load
 */
/**
 * @typedef {($: import('cheerio').CheerioAPI, dom: import('cheerio').Cheerio<import('cheerio').Document>, options: CollectOptions<T>, helpers: Helpers) => Promise<import('@chialab/esbuild-rna').OnTransformResult[]>} Collector
 * @template {object} T
 */
/**
 * A HTML loader plugin for esbuild.
 * @param {PluginOptions} options
 * @returns An esbuild plugin.
 */
export default function _default({ scriptsTarget, modulesTarget, minifyOptions, injectStylesAs, }?: PluginOptions): import("esbuild").Plugin;
export type PluginOptions = {
    scriptsTarget?: string | undefined;
    modulesTarget?: string | string[] | undefined;
    entryNames?: string | undefined;
    chunkNames?: string | undefined;
    assetNames?: string | undefined;
    injectStylesAs?: "link" | "script" | undefined;
    minifyOptions?: import("htmlnano").HtmlnanoOptions | undefined;
};
export type BuildOptions = {
    sourceDir: string;
    outDir: string;
    entryDir: string;
    workingDir: string;
    target: (string | string[])[];
};
export type CollectOptions<T extends object> = BuildOptions & T;
export type Helpers = {
    createEntry: (ext: string, suggestion?: string) => string;
    resolveAssetFile: (filePath: string, buffer?: Buffer) => string;
    emitFile: (path: string, contents?: string | Buffer) => Promise<import('@chialab/esbuild-rna').File>;
    emitChunk: (options: import('@chialab/esbuild-rna').EmitChunkOptions) => Promise<import('@chialab/esbuild-rna').Chunk>;
    emitBuild: (options: import('@chialab/esbuild-rna').EmitBuildOptions) => Promise<import('@chialab/esbuild-rna').Result>;
    resolve: (file: string) => Promise<import('esbuild').OnResolveResult>;
    resolveRelativePath: (filePath: string, from?: string | null, prefix?: string) => string;
    load: (file: string, options: Partial<import('esbuild').OnLoadArgs>) => Promise<import('esbuild').OnLoadResult | undefined>;
};
export type Collector<T extends object> = ($: import('cheerio').CheerioAPI, dom: import('cheerio').Cheerio<import('cheerio').Document>, options: CollectOptions<T>, helpers: Helpers) => Promise<import('@chialab/esbuild-rna').OnTransformResult[]>;
export type Metafile = import('esbuild').Metafile;
import { Buffer } from 'buffer';
