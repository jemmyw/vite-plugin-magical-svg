# Magical SVG 🪄
[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-support%20me-EA4AAA?style=flat-square)](https://github.com/sponsors/cyyynthia)
[![License](https://img.shields.io/github/license/cyyynthia/vite-plugin-magical-svg.svg?style=flat-square)](https://github.com/cyyynthia/vite-plugin-magical-svg/blob/mistress/LICENSE)
[![npm](https://img.shields.io/npm/v/vite-plugin-magical-svg?style=flat-square)](https://npm.im/vite-plugin-magical-svg)

An all-in-one [Vite](https://vitejs.dev/) plugin that magically makes working with SVGs and bundling them a breeze.

Can mostly be used as a [drop-in replacement of SVGR](#migrating-from-svgr) and similar tools.

## Backstory
Inspired by a [tweet](https://twitter.com/_developit/status/1382838799420514317) from Preact's creator Jason Miller,
I've been looking at plugins that would let me work with SVGs, as I myself did the error of embedding SVGs as React
components. Shame!

What I wanted was a plugin that would let me import SVGs, and make a sprite of symbols and give me the identifier I
can use in `<use href='???'/>`. And I couldn't find any decent plugin that makes working with them easy. They all had
a problem that made using them a pain, or outright impractical. Here's a list of the problems I encountered:

- References in SVG files are never processed. `<image href='...'/>` would never get processed and the referenced asset is ignored.
- The generated sprite include ALL icons, even unused ones. Just picking the right icons from a pack isn't an option.
- There are no options to output to a separate file and reference it. Inlining is apparently the only way.
- Selectively tell to not process a specific SVG isn't possible (e.g.: A logo, or SVGs that break when encapsulated in a symbol).
- You can't make different sprites, it's only all-in-one.

So I decided to make my own tool to solve all these problems. Introducing: the Magical SVG plugin. 🪄

## Install
```
pnpm i vite-plugin-magical-svg
yarn add vite-plugin-magical-svg
npm i vite-plugin-magical-svg
```

## Usage
### Vite plugin setup
```js
import { defineConfig } from 'vite'
import magicalSvg from 'vite-plugin-magical-svg'

export default defineConfig({
	plugins: [
		magicalSvg({
			// By default, the output will be a dom element (the <svg> you can use inside the webpage).
			// You can also change the output to react (or any supported target) to get a component you can use.
			target: 'preact',

			// By default, the svgs are optimized with svgo. You can disable this by setting this to false.
			svgo: false,
		
			// By default, width and height set on SVGs are not preserved.
			// Set to true to preserve `width` and `height` on the generated SVG.
			preserveWidthHeight: false,
			
			// *Experimental* - set the width and height on generated SVGs.
			// If used with `preserveWidthHeight`, will only apply to SVGs without a width/height.
			setWidthHeight: { width: '24', height: '24' },

			// *Experimental* - replace all instances of `fill="..."` and `stroke="..."`.
			// Set to `true` for 'currentColor`, or use a text value to set it to this value.
			// Disabled by default.
			setFillStrokeColor: true,

			// *Experimental* - if a SVG comes with `width` and `height` set but no `viewBox`,
			// assume the viewbox is `0 0 {width} {height}` and add it to the SVG.
			// Disabled by default.
			restoreMissingViewBox: true,
		})
	]
})
```

#### Targets
- `dom` (default): exports a function you can call (takes no arguments) and returns a DOM element.
- `react`: exports a functional React component (classic runtime; wrapped in `forwardRef`)
- `react-jsx`: exports a functional React component (automatic runtime; wrapped in `forwardRef`)
- `preact`: exports a functional Preact component (classic runtime; wrapped in `forwardRef`)
- `preact-jsx`: exports a functional Preact component (automatic runtime; wrapped in `forwardRef`)
- `vue`: exports a Vue component (as if it was a `.vue` file)
- `solid`: exports a Solid component

### Use in code
```js
import MySvg from './assets/icon.svg' // Basic import, as a sprite
import MySvg from './assets/icon.svg?sprite=owo' // Named sprites
import MySvg from './assets/icon.svg?sprite=inline' // Special sprite, inlined in the HTML document
import fileUrl from './assets/icon.svg?file' // Works like .png and other file imports
```

### SVG processing
```xml
<svg viewBox='0 0 250 250'>
	<image href='./assets/image.png' /> <!-- Image will be imported, bundled, and the href will be replaced -->
	<image href='./assets/icon.svg' /> <!-- SVG will be imported as a file (implicit ?file) -->
	<use href='./assets/icon.svg' /> <!-- SVG will be imported and added to the sprite -->
</svg>
```

### `exports` note
This plugin **does not** respect the `exports` field when importing svg files from third-party packages such as
`simple-icons`, which do not expose them.

### Migrating from SVGR
This plugin can mostly be used as a drop-in replacement of SVGR; unless you're dealing with complex SVGs or need to
style/animate individual parts of the SVG, the code generated by this plugin should behave just as you're used to,
plus the [preprocessing of your SVGs](#svg-processing).

Make sure to enable `preserveWidthHeight` for best compatibility. This option is not enabled by default as it was not
done historically by the plugin, and suddenly doing it would be a breaking change.
