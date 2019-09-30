/* eslint-disable unicorn/no-process-exit */
import { exec as fsExec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";

import ops from "../../operators.json";

const INPUT_DIR = path.join(__dirname, `../icons/`);
const TARGET_DIR = path.join(__dirname, `../dist/`);

/**
 * Executes a command and returns a promise of it's Out/Error buffers
 * @param command - The command to run, with space-separated arguments.
 * @returns {Promise} Returns either `Promise.resolve` or `Promise.reject`
 */
function execute(command: string) {
    return new Promise((resolve, reject) => {
        fsExec(command, {}, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve([stdout, stderr]);
            }
        });
    });
}

/**
 * Generates the icons using Inkscape, optimizes them with SVGO and places them into `TARGET_DIR/[OPERATOR.ID]`
 * @param array - Array containing the operator objects (operators.json)
 * @returns {Promise} Returns either `Promise.resolve` or `Promise.reject`
 */
async function generateIcon(array: string[]) {
    // counter vars
    const inputCount = array.length;
    let outputCount = 0;

    console.log(chalk.blue("Starting generation of PNG & SVG files..."));

    // check if TARGET_DIR exist and create if not
    await fs.stat(TARGET_DIR).catch(() => {
        // prettier-ignore
        console.warn(`${chalk.yellow(`TARGET_DIR (${TARGET_DIR})`)} does not exist, creating directiory...`);
        fs.mkdir(TARGET_DIR);
    });

    // map the icon array
    const result = array.map(async op => {
        // set path to icon
        const iconPath = path.resolve(INPUT_DIR, `${op}.ai`);

        // check if input file exists
        await fs.stat(iconPath).catch(() => {
            throw new Error(`${op} failed: No file found at ${iconPath}`);
        });

        // set output path for operator
        const outputPath = path.resolve(TARGET_DIR + path.sep + op);

        // check if folder for operator exists
        await fs.stat(outputPath).catch(() => {
            // prettier-ignore
            console.warn(`${chalk.yellow.bold(outputPath)} does not exist, creating directory...`);
            fs.mkdir(outputPath);
        });

        // function to create the path for the exported files
        const targetFile = (extension: string) =>
            path.resolve(`${outputPath}${path.sep}${op}.${extension}`);

        // copy AI files over to dist
        await fs.copyFile(iconPath, targetFile("ai"));

        // export the icon as png and svg with inkscape
        // prettier-ignore
        await execute(
            `inkscape -f ${iconPath} --export-width 1400 --export-height 1400 -e ${targetFile("png")}`);
        // prettier-ignore
        await execute(
            `inkscape -f ${iconPath} --export-plain-svg=${targetFile("svg")}`
        );

        // optimize the svg with SVGO
        // prettier-ignore
        await execute(`svgo -i ${targetFile("svg")} --multipass --enable=removeDimensions --disable=convertPathData,removeRasterImages`);

        // increase counter when finished and output it to the console
        outputCount += 1;
        console.log(
            `${outputCount}/${inputCount} - ${chalk.cyan(op)} finished!`
        );

        // return when finished
        return op;
    });

    // wait for all promises to finish
    await Promise.all(result)
        .then(() => {
            // prettier-ignore
            return console.log(chalk.green(`${outputCount}/${inputCount} items successfully generated! \nOutput folder: ${TARGET_DIR}`));
        })
        .catch(error => {
            // prettier-ignore
            console.log(chalk.bold.red(`A error occured while generating the items!`));
            console.log(chalk.red(error.stack));
            process.exit(1);
        });
}

generateIcon(Object.keys(ops));
