import path from "path";
import chalk from "chalk";
import archiver from "archiver";
import { createWriteStream, createReadStream } from "fs";
import * as packageConfig from "../../package.json";
import { OUTPUT_DIR, README_PATH, LICENSE_PATH } from "../config";

export default function buildIconPackage(iconObject: {}) {
    // inform user that script has started
    console.log(chalk.blue("Building icon zip package..."));

    // set filename + output file
    const fileName = `r6operators-${packageConfig.version}.zip`;
    const outputFile = path.resolve(`${OUTPUT_DIR}${path.sep}${fileName}`);

    // initialize archiver
    const output = createWriteStream(outputFile);
    const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
        store: true
    });

    // pipe archive data to the file
    archive.pipe(output);

    // add files to root folder
    archive.file(README_PATH, { name: `readme.txt` });
    archive.file(LICENSE_PATH, { name: `license.txt` });

    // map object and append each icon to the respective folder
    Object.keys(iconObject).forEach((op: string) => {
        // function to create the path for the exported files
        const targetFile = (extension: string) =>
            path.resolve(
                `${OUTPUT_DIR}${path.sep}${op}${path.sep}${op}.${extension}`
            );

        // add icon files to archive
        archive.append(createReadStream(targetFile("ai")), {
            name: `Illustrator (AI)/${op}.ai`
        });
        archive.append(createReadStream(targetFile("png")), {
            name: `High-resolution raster image (PNG)/${op}.png`
        });
        archive.append(createReadStream(targetFile("svg")), {
            name: `Scalable vector graphic (SVG)/${op}.svg`
        });
    });

    // finalize it and save it
    archive.finalize();

    // inform user that action has finished and return
    console.log(chalk.green(`Successfully built ${outputFile}!\n`));
    return outputFile;
}
