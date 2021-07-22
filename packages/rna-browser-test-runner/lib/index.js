import path from 'path';
import { createRequire } from 'module';
import { mochaReporter } from '@chialab/wtr-mocha-reporter';

const require = createRequire(import.meta.url);

/**
 * @typedef {Partial<Omit<import('@web/test-runner-core').TestRunnerCoreConfig, 'browsers'>> & { browsers?: string[]|import('@web/test-runner-core').BrowserLauncher[] }} TestRunnerConfig
 */

/**
 * @typedef {import('@web/test-runner-core').TestRunner} TestRunner
 */

/**
 * @typedef {import('@web/test-runner-core').TestRunnerPlugin} TestRunnerPlugin
 */

/**
 * @typedef {import('@web/test-runner-core').TestFramework} TestFramework
 */

/**
 * @typedef {import('@web/test-runner-core').BrowserLauncher} BrowserLauncher
 */

/**
 * @typedef {import('@web/test-runner-core').Reporter} Reporter
 */

/**
 * Start the test runner.
 * @param {TestRunnerConfig} config
 */
export async function startTestRunner(config) {
    const [
        { TestRunner, TestRunnerCli },
        { buildMiddlewares, buildPlugins },
        { createLogger },
    ] = await Promise.all([
        import('@web/test-runner-core'),
        import('@chialab/rna-dev-server'),
        import('./createLogger.js'),
    ]);
    const testFramework =
        /**
         * @type {TestFramework}
         */
        ({
            path: path.relative(process.cwd(), require.resolve('@web/test-runner-mocha/dist/autorun.js')),
            config: {
                ui: 'bdd',
                timeout: '10000',
            },
        });

    /**
     * @type {import('@web/test-runner-core').TestRunnerCoreConfig}
     */
    const runnerConfig = {
        rootDir: process.cwd(),
        protocol: 'http:',
        hostname: 'localhost',
        logger: createLogger(),
        browserStartTimeout: 2 * 60 * 1000,
        testsStartTimeout: 20 * 1000,
        testsFinishTimeout: 2 * 60 * 1000,
        concurrency: 2,
        concurrentBrowsers: 2,
        files: [
            'test/**/*.test.js',
            'test/**/*.spec.js',
        ],
        coverageConfig: {
            exclude: [
                '**/node_modules/**/*',
                '**/web_modules/**/*',
                '**/__wds-outside-root__/**',
            ],
            threshold: { statements: 0, functions: 0, branches: 0, lines: 0 },
            report: true,
            reportDir: 'coverage',
            reporters: ['lcov'],
        },
        reporters: [
            mochaReporter(),
        ],
        testFramework,
        open: false,
        browserLogs: true,
        ...(/** @type {*} */ (config)),
        port: config.port || 8080,
        middleware: [
            ...(await buildMiddlewares()),
            ...(config.middleware || []),
        ],
        plugins: [
            ...(await buildPlugins()),
            ...(config.plugins || []),
        ],
    };

    const runner = new TestRunner(runnerConfig);
    const cli = new TestRunnerCli(runnerConfig, runner);

    return {
        runner,
        cli,
    };
}

/**
 * Start the test runner.
 * @param {TestRunnerConfig} config
 * @return {Promise<TestRunner>} The test runner instance.
 */
export async function test(config) {
    const { runner, cli } = await startTestRunner(config);

    await runner.start();
    cli.start();

    process.on('uncaughtException', error => {
        // eslint-disable-next-line no-console
        console.error(error);
    });

    process.on('exit', async () => {
        await runner.stop();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        await runner.stop();
        process.exit(0);
    });

    runner.on('stopped', (passed) => {
        process.exit(passed ? 0 : 1);
    });

    return runner;
}

/**
 * @param {import('commander').Command} program
 */
export function command(program) {
    program
        .command('test:browser [specs...]')
        .description('Start a browser test runner (https://modern-web.dev/docs/test-runner/overview/) based on the web dev server. It uses mocha (https://mochajs.org/) but you still need to import an assertion library (recommended https://open-wc.org/docs/testing/testing-package/).')
        .option('-P, --port', 'dev server port')
        .option('--watch', 'watch test files')
        .option('--concurrency <number>', 'number of concurrent browsers', parseInt)
        .option('--manual', 'manual test mode')
        .option('--open', 'open the browser')
        .option('--coverage', 'add coverage to tests')
        .action(
            /**
             * @param {string[]} specs
             * @param {{ port?: number, watch?: boolean, concurrency?: number, coverage?: boolean, manual?: boolean; open?: boolean }} options
             */
            async (specs, { port, watch, concurrency, coverage, manual, open }) => {
                /**
                 * @type {TestRunnerPlugin[]}
                 */
                const plugins = [];

                /**
                 * @type {TestRunnerConfig}
                 */
                const config = {
                    port,
                    watch,
                    concurrentBrowsers: concurrency || 2,
                    coverage,
                    manual: manual || open === true,
                    open,
                    plugins,
                    browsers: [
                        (await import('@web/test-runner-chrome')).chromeLauncher(),
                    ],
                };

                if (specs.length) {
                    config.files = specs;
                }

                try {
                    const { legacyPlugin } = await import('@chialab/wds-plugin-legacy');
                    plugins.push(legacyPlugin({
                        minify: true,
                    }));
                } catch (err) {
                    //
                }

                await test(config);
            }
        );
}
