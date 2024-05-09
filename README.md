### esbuild-plugin-html

`esbuild-plugin-html` with [edoardocavazza's](https://github.com/edoardocavazza) patch for [injecting styles via link elements](https://github.com/chialab/rna/pull/176), stripped from the [rna monorepo](https://github.com/chialab/rna).

This repo is ready-to-go with types and dist already generated. You can just in your `package.json` as a drop-in replacement:

```
"devDependencies": {
	"@chialab/esbuild-plugin-html": "benjamingwynn/esbuild-plugin-html"
}
```

The motivation for this was to get Svelte CSS output with esbuild properly working, specifically for the build system of my [tetromino game](https://github.com/benjamin)

So TLDR this repo is a drop-in replacement for htmlPlugin but allows the following override option:

```
import htmlPlugin from "@chialab/esbuild-plugin-html"

const esbuildOptions = {
	// ...
	plugins: [
		htmlPlugin({
			injectStylesAs: "link",
		}),
		// ...
	]
	// ...
}
```

Which stops Svelte CSS outputting in `function loadStyle(url)` format.
