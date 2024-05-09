/**
 * Generate launch screen image buffer.
 * @param {import('./generator.js').Image} image The base icon buffer.
 * @param {number} width The launch screen size.
 * @param {number} height The launch screen size.
 * @param {number} gutter The gutter size.
 * @param {import('@jimp/core').RGBA} background The background color to use.
 * @returns Launch screen buffer.
 */
export function generateLaunch(image: import('./generator.js').Image, width: number, height: number, gutter: number, background: any): Promise<Buffer>;
