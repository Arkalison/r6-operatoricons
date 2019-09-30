/* eslint-disable unicorn/no-process-exit */
import path from "path";
import chalk from "chalk";
import { promises as fs } from "fs";

import ops from "../../operators.json";

const INPUT_DIR = path.join(__dirname, `../../dist`);
const OUTPUT = path.join(__dirname, `../../dist/icons.json`);

/**
 * Generates the IconObject json file containing the SVG contents + operator object data
 * @param inputObject - Object containing the operator data (operators.json)
 */
function buildIconsObject(inputObject) {
    // map the icon array
    const result = Object.keys(inputObject).map(op => {
        const name: string = op;
        const filePath: string = path.resolve(
            `${INPUT_DIR}${path.sep}${op}${path.sep}${op}.svg`
        );

        // read file to get SVG content
        return fs.readFile(filePath, "utf-8").then(output => {
            // create a new object
            const object = {
                [name as string]: {
                    ...inputObject[op], // all existing contents of the object
                    ["contents" as string]: output // svg string
                }
            };
            return object;
        });
    });
    // wait for all promises to finish
    Promise.all(result)
        .then(resolved => {
            // merge all objects from the promises and write to OUTPUT
            const merged = Object.assign({}, ...resolved);
            console.log(
                // prettier-ignore
                chalk.green(`Successfully generated the IconObject json file! \nOutput: ${OUTPUT}`)
            );
            return fs.writeFile(OUTPUT, JSON.stringify(merged));
        })
        .catch(error => {
            console.log(
                // prettier-ignore
                chalk.bold.red(`A error occured while generating the IconObject!`)
            );
            console.log(chalk.red(error.stack));
            process.exit(1);
        });
}

buildIconsObject(ops);
