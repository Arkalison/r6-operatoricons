import chalk from "chalk";
import path from "path";
import { promises as fs } from "fs";
import { OUTPUT_DIR } from "../config";

export default async function buildIconJson(iconObject: {}) {
    // inform user that script has started
    console.log(chalk.blue("Building icons.json..."));

    // map the icon object
    const result = Object.keys(iconObject).map(async op => {
        // set name + file path of svg
        const name: string = op;
        const svgPath: string = path.resolve(
            `${OUTPUT_DIR}${path.sep}${op}${path.sep}${op}.svg`
        );
        // read file to get SVG content
        return fs.readFile(svgPath).then(output => {
            // create a new object
            const object = {
                [name as string]: {
                    ...iconObject[op], // all existing contents of the object
                    ["contents" as string]: output // svg string
                }
            };
            // return new object to promise
            return object;
        });
    });

    // wait for all promises to finish
    await Promise.all(result)
        .then(resolved => {
            // set output file path
            const outputPath = path.resolve(
                `${OUTPUT_DIR}${path.sep}icons.json`
            );

            // merge all objects from the promises and write to OUTPUT
            const merged = Object.assign({}, ...resolved);
            fs.writeFile(outputPath, JSON.stringify(merged));

            // inform user that action has finished
            console.log(chalk.green(`Successfully built ${outputPath}!\n`));
            return resolved;
        })
        .catch(error => {
            throw error;
        });
}
