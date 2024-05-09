export default Jimp;
export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type Image = ThenArg<ReturnType<(typeof Jimp)['read']>>;
declare const Jimp: import(".pnpm/@jimp+core@0.22.12/node_modules/@jimp/core").JimpConstructors & {
    MIME_JPEG: "image/jpeg";
} & {
    MIME_PNG: "image/png";
    PNG_FILTER_AUTO: -1;
    PNG_FILTER_NONE: 0;
    PNG_FILTER_SUB: 1;
    PNG_FILTER_UP: 2;
    PNG_FILTER_AVERAGE: 3;
    PNG_FILTER_PATH: 4;
} & {
    RESIZE_NEAREST_NEIGHBOR: "nearestNeighbor";
    RESIZE_BILINEAR: "bilinearInterpolation";
    RESIZE_BICUBIC: "bicubicInterpolation";
    RESIZE_HERMITE: "hermiteInterpolation";
    RESIZE_BEZIER: "bezierInterpolation";
} & {
    encoders: {
        "image/jpeg": import(".pnpm/@jimp+core@0.22.12/node_modules/@jimp/core").EncoderFn;
    } & {
        "image/png": import(".pnpm/@jimp+core@0.22.12/node_modules/@jimp/core").EncoderFn;
    };
    decoders: {
        "image/jpeg": import(".pnpm/@jimp+core@0.22.12/node_modules/@jimp/core").DecoderFn;
    } & {
        "image/png": import(".pnpm/@jimp+core@0.22.12/node_modules/@jimp/core").DecoderFn;
    };
} & {
    prototype: import(".pnpm/@jimp+core@0.22.12/node_modules/@jimp/core").WellFormedPlugin<import(".pnpm/@jimp+core@0.22.12/node_modules/@jimp/core").Image> & Required<Pick<import(".pnpm/@jimp+core@0.22.12/node_modules/@jimp/core").WellFormedPlugin<import(".pnpm/@jimp+core@0.22.12/node_modules/@jimp/core").Image>, "mime">> & import("@jimp/jpeg").JpegClass & import("@jimp/png").PNGClass & import("@jimp/plugin-resize").ResizeClass;
};
