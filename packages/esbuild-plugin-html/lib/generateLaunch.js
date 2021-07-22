/**
 * Generate launch screen image buffer.
 * @param {string} fileName The base launch screen file.
 * @param {number} width The launch screen size.
 * @param {number} height The launch screen size.
 * @param {number} gutter The gutter size.
 * @param {import('@jimp/core').RGBA} background The background color to use.
 * @param {string} [mime] The mimetype.
 * @return Launch screen buffer.
 */
export async function generateLaunch(fileName, width, height, gutter, background, mime = 'image/png') {
    const { default: Jimp } = await import('./generator.js');
    const image = await Jimp.read(fileName);
    const gutterAlpha = image.hasAlpha() ? (gutter || 0) : 0;
    const launchBackground = (() => {
        if (image.hasAlpha()) {
            return null;
        }
        const topLeftColor = image.getPixelColor(0, 0);
        const topRightColor = image.getPixelColor(image.bitmap.width - 1, 0);
        const bottomLeftColor = image.getPixelColor(0, image.bitmap.height - 1);
        const bottomRightColor = image.getPixelColor(image.bitmap.width - 1, image.bitmap.height - 1);
        if (topLeftColor === topRightColor &&
            topLeftColor === bottomLeftColor &&
            topLeftColor === bottomRightColor) {
            const color = Jimp.intToRGBA(topLeftColor);
            color.a = 1;
            return color;
        }
        return null;
    })() || background;
    const size = Math.round(Math.min(height / 6, width / 6)) - (gutterAlpha || 0);
    const color = `rgba(${launchBackground.r}, ${launchBackground.g}, ${launchBackground.b}, ${launchBackground.a})`;
    const launchBuffer = new Jimp(width, height, color);
    launchBuffer.composite(image.resize(size, size), (width - size) / 2, (height - size) / 2);
    return launchBuffer.getBufferAsync(mime);
}
