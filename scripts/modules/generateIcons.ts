import chalk from "chalk";
import path from "path";
import { promises as fs } from "fs";
import {
    ICON_DIR,
    OUTPUT_DIR,
    PNG_OPTIONS,
    SVGO_OPTIONS,
    README_PATH
} from "../config";
import exec from "../util/exec";

export default async function generateIcons(iconObject: {}) {
    // inform user that script has started
    console.log(
        chalk.blue("Starting generation of operator PNG, SVG and ZIP files...")
    );

    // set counter vars
    const inputCount = Object.keys(iconObject).length;
    let outputCount = 0;

    // check if TARGET_DIR exist and create if not
    await fs.stat(OUTPUT_DIR).catch(async () => {
        console.warn(chalk.yellow("OUTPUT_DIR does not exist, creating..."));
        await fs.mkdir(OUTPUT_DIR);
    });

    // map the icon object
    const result = Object.keys(iconObject).map(async op => {
        // set path to icon + dest path
        const iconPath = path.resolve(ICON_DIR, `${op}.ai`);
        const destPath = path.resolve(OUTPUT_DIR + path.sep + op);

        // function to create the path for the exported files
        const targetFile = (extension: string) =>
            path.resolve(`${destPath}${path.sep}${op}.${extension}`);

        // check if input file exists
        await fs.stat(iconPath).catch(() => {
            throw new TypeError(
                `No file found at "${destPath}" but "${op}" was referenced in operators.json`
            );
        });

        // check if destPath exists
        await fs.stat(destPath).catch(async () => {
            await fs.mkdir(destPath);
        });

        // copy AI files over to dist
        await fs.copyFile(iconPath, targetFile("ai"));

        // export the icon as png and svg with inkscape
        await exec(
            `inkscape -f ${iconPath} ${PNG_OPTIONS} -e ${targetFile("png")}`
        );
        await exec(
            `inkscape -f ${iconPath} --export-plain-svg=${targetFile("svg")}`
        );

        // optimize the svg with SVGO
        await exec(`svgo -i ${targetFile("svg")} ${SVGO_OPTIONS}`);

        // zip all files from the folder + append readme
        await exec(`7z a ${targetFile("zip")} ${destPath}/*`);
        await exec(`7z a ${targetFile("zip")} ${README_PATH}`);

        // increase counter when finished and output it to the console
        outputCount += 1;
        console.log(
            `${outputCount}/${inputCount} - ${chalk.cyan(op)} finished!`
        );

        // return operator name to promise
        return op;
    });

    // wait for all promises to finish
    await Promise.all(result)
        .then(resolved => {
            console.info(
                // prettier-ignore
                chalk.green(`\n${outputCount}/${inputCount} items successfully generated!`)
            );
            console.log(`Output folder: ${OUTPUT_DIR}\n`);
            return resolved;
        })
        .catch(error => {
            throw error;
        });
}
