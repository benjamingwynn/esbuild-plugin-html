import { fileURLToPath } from 'url';
import cssImportPlugin from '@chialab/esbuild-plugin-css-import';
import { expect } from 'chai';
import esbuild from 'esbuild';

describe('esbuild-plugin-css-import', () => {
    it('should resolve css imports', async () => {
        const {
            outputFiles: [result],
        } = await esbuild.build({
            absWorkingDir: fileURLToPath(new URL('.', import.meta.url)),
            entryPoints: [fileURLToPath(new URL('fixture/input.css', import.meta.url))],
            sourceRoot: fileURLToPath(new URL('fixture', import.meta.url)),
            bundle: true,
            write: false,
            plugins: [cssImportPlugin()],
        });

        expect(result.text).to.be.equal(`/* fixture/node_modules/test-lib/lib.css */
html,
body {
  margin: 0;
  padding: 0;
}

/* fixture/input.css */
`);
    });

    it('should ignore external modules', async () => {
        const {
            outputFiles: [result],
        } = await esbuild.build({
            absWorkingDir: fileURLToPath(new URL('.', import.meta.url)),
            entryPoints: [fileURLToPath(new URL('fixture/input.css', import.meta.url))],
            sourceRoot: fileURLToPath(new URL('fixture', import.meta.url)),
            bundle: true,
            write: false,
            external: ['test-lib'],
            plugins: [cssImportPlugin()],
        });

        expect(result.text).to.be.equal(`@import "test-lib";

/* fixture/input.css */
`);
    });
});
