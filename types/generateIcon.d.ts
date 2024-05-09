/**
 * Generate icon image buffer.
 * @param {import('./generator.js').Image} image The base icon buffer.
 * @param {number} size The icon size.
 * @param {number} gutter The gutter size.
 * @param {import('@jimp/core').RGBA} background The background color to use.

 */
export function generateIcon(image: import('./generator.js').Image, size: number, gutter: number, background: any): Promise<Buffer>;
