import path from 'path';
import { rm } from 'fs/promises';
import { createLogger } from '@chialab/rna-logger';
import { loaders } from './loaders.js';
import { writeManifestJson } from './writeManifestJson.js';
import { writeEntrypointsJson } from './writeEntrypointsJson.js';
import { mergeDependencies } from './mergeDependencies.js';

/**
 * @typedef {import('esbuild').Metafile} Metafile
 */

/**
 * @typedef {import('esbuild').BuildResult & { metafile: Metafile, dependencies: import('@chialab/esbuild-plugin-dependencies').DependenciesMap, outputFiles?: import('esbuild').OutputFile[] }} BuildResult
 */

/**
 * @param {import('@chialab/rna-config-loader').EntrypointFinalBuildConfig} config
 * @param {{ stdin?: import('esbuild').StdinOptions; entryPoints?: string[] }} entryOptions
 * @param {import('esbuild').BuildResult} result
 */
async function onBuildEnd(config, entryOptions, result) {
    const {
        root,
        publicPath,
        format,
        manifestPath,
        entrypointsPath,
    } = config;

    if (manifestPath && result) {
        await writeManifestJson(result, manifestPath, publicPath);
    }
    if (entrypointsPath && entryOptions.entryPoints && result) {
        await writeEntrypointsJson(entryOptions.entryPoints, result, root, entrypointsPath, publicPath, format);
    }
}

/**
 * Build and bundle sources.
 * @param {import('@chialab/rna-config-loader').EntrypointFinalBuildConfig} config
 * @return {Promise<BuildResult>} The esbuild bundle result.
 */
export async function build(config) {
    const { default: esbuild } = await import('esbuild');
    const logger = createLogger();
    const hasOutputFile = !!path.extname(config.output);

    const {
        input,
        output,
        root,
        code,
        loader,
        format,
        target,
        platform,
        sourcemap,
        minify,
        bundle,
        splitting = format === 'esm' && !hasOutputFile,
        globalName,
        entryNames,
        chunkNames,
        assetNames,
        define,
        external,
        alias,
        jsxFactory,
        jsxFragment,
        jsxModule,
        jsxExport,
        plugins,
        transformPlugins,
        logLevel,
        clean,
        watch,
        write = true,
    } = config;

    const entryOptions = {};
    if (code) {
        entryOptions.stdin = {
            contents: code,
            loader,
            resolveDir: root,
            sourcefile: Array.isArray(input) ? input[0] : input,
        };
    } else if (input) {
        entryOptions.entryPoints = Array.isArray(input) ? input : [input];
    }

    const outputDir = hasOutputFile ? path.dirname(output) : output;
    if (clean) {
        await rm(path.resolve(root, outputDir), { recursive: true, force: true });
    }

    const { default: dependenciesPlugin } = await import('@chialab/esbuild-plugin-dependencies');
    const finalPlugins = await Promise.all([
        import('@chialab/esbuild-plugin-emit')
            .then(({ default: plugin }) => plugin()),
        import('@chialab/esbuild-plugin-any-file')
            .then(({ default: plugin }) =>
                plugin({
                    fsCheck: true,
                    shouldThrow(args) {
                        return !args.path.includes('/node_modules/');
                    },
                })
            ),
        import('@chialab/esbuild-plugin-env')
            .then(({ default: plugin }) => plugin()),
        import('@chialab/esbuild-plugin-define-this')
            .then(({ default: plugin }) => plugin()),
        import('@chialab/esbuild-plugin-jsx-import')
            .then(({ default: plugin }) => plugin({ jsxModule, jsxExport })),
        import('@chialab/esbuild-plugin-bundle-dependencies')
            .then(({ default: plugin }) => plugin({
                dependencies: !bundle,
                peerDependencies: !bundle,
                optionalDependencies: !bundle,
            })),
        ...plugins,
        import('@chialab/esbuild-plugin-transform')
            .then(async ({ default: plugin }) =>
                plugin([
                    await import('@chialab/esbuild-plugin-alias')
                        .then(({ default: plugin }) => plugin(alias)),
                    ...transformPlugins,
                ])
            ),
        dependenciesPlugin(),
    ]);

    const result = /** @type {BuildResult} */ (await esbuild.build({
        ...entryOptions,
        outfile: hasOutputFile ? output : undefined,
        outdir: hasOutputFile ? undefined : output,
        format,
        target,
        platform,
        sourcemap,
        minify,
        globalName,
        entryNames,
        chunkNames,
        assetNames,
        splitting,
        metafile: true,
        bundle: true,
        treeShaking: minify ? true : undefined,
        define,
        external,
        mainFields: [
            'module',
            'esnext',
            'jsnext',
            'jsnext:main',
            ...(platform === 'browser' ? ['browser'] : []),
            'main',
        ],
        jsxFactory,
        jsxFragment,
        loader: loaders,
        preserveSymlinks: true,
        sourcesContent: true,
        plugins: finalPlugins,
        logLevel,
        absWorkingDir: root,
        watch: watch && {
            onRebuild(error, result) {
                if (result) {
                    onBuildEnd(config, entryOptions, result);
                }
                if (typeof watch === 'object' &&
                    typeof watch.onRebuild === 'function') {
                    return watch.onRebuild(error, result);
                } else if (error) {
                    logger.error(error);
                }
            },
        },
        write,
        allowOverwrite: !write,
    }));

    await onBuildEnd(config, entryOptions, result);

    return {
        ...result,
        dependencies: mergeDependencies(result, root),
    };
}
