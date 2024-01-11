import { fileURLToPath } from 'url';
import virtualPlugin, { createVirtualPlugin } from '@chialab/esbuild-plugin-virtual';
import { expect } from 'chai';
import esbuild from 'esbuild';

describe('esbuild-plugin-virtual', () => {
    it('should load virtual modules', async () => {
        const {
            outputFiles: [result],
        } = await esbuild.build({
            stdin: {
                sourcefile: fileURLToPath(import.meta.url),
                contents: `import { test } from 'virtualMod';
export { test }`,
            },
            format: 'esm',
            target: 'esnext',
            bundle: true,
            write: false,
            plugins: [
                virtualPlugin([
                    {
                        path: 'virtualMod',
                        contents: 'export const test = () => {};',
                        loader: 'js',
                    },
                ]),
            ],
        });

        expect(result.text).to.equal(`// virtualMod
var test = () => {
};
export {
  test
};
`);
    });

    it('should load virtual modules with a new plugin instance', async () => {
        const {
            outputFiles: [result],
        } = await esbuild.build({
            stdin: {
                sourcefile: fileURLToPath(import.meta.url),
                contents: `import { test } from 'virtualMod';
export { test }`,
            },
            format: 'esm',
            target: 'esnext',
            bundle: true,
            write: false,
            plugins: [
                createVirtualPlugin()([
                    {
                        path: 'virtualMod',
                        contents: 'export const test = () => {};',
                        loader: 'js',
                    },
                ]),
            ],
        });

        expect(result.text).to.equal(`// virtualMod
var test = () => {
};
export {
  test
};
`);
    });

    it('should load css virtual modules', async () => {
        const {
            outputFiles: [result],
        } = await esbuild.build({
            stdin: {
                sourcefile: fileURLToPath(import.meta.url),
                contents: "@import 'virtualMod';",
                loader: 'css',
            },
            format: 'esm',
            target: 'esnext',
            bundle: true,
            write: false,
            plugins: [
                virtualPlugin([
                    {
                        path: 'virtualMod',
                        contents: 'body { color: red; }',
                        loader: 'css',
                    },
                ]),
            ],
        });

        expect(result.text).to.equal(`/* virtualMod */
body {
  color: red;
}

/* packages/esbuild-plugin-virtual/test/test.spec.js */
`);
    });
});
