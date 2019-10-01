/* eslint-disable unicorn/prevent-abbreviations */
import path from "path";

const ICON_DIR = path.join(__dirname, `../icons/`);
const OUTPUT_DIR = path.join(__dirname, `../dist/`);

const README_PATH = path.resolve(__dirname, "./util/readme.txt");
const LICENSE_PATH = path.resolve(__dirname, "../license.txt");

const PNG_OPTIONS = "--export-width 1400 --export-height 1400";
const SVGO_OPTIONS =
    "--multipass --enable=removeDimensions --disable=convertPathData,removeRasterImages";

export {
    ICON_DIR,
    OUTPUT_DIR,
    README_PATH,
    LICENSE_PATH,
    PNG_OPTIONS,
    SVGO_OPTIONS
};
