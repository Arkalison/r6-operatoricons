import fs from "fs";
import archiver from "archiver";

import * as config from "../config";
import * as packageConfig from "../../package.json";

// create full package for release
export default async function generatePACKAGE(iconArray, sourcePath, destinationPath) {
    return new Promise((resolve, reject) => {
        // filename of the package zip
        const fileName = `r6-operatoricons-${packageConfig.version}.zip`;

        // check if dest folder exists and create it
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }

        // initialize archiver
        const output = fs.createWriteStream(`${destinationPath}${fileName}`);
        const archive = archiver("zip", {
            zlib: { level: 9 }, // Sets the compression level.
            store: true
        });

        // catch errors
        output.on("error", error => {
            reject(error);
        });

        // resolve on finish
        output.on("finish", () => {
            resolve(output);
        });

        // catch warnings (ie stat failures and other non-blocking errors)
        archive.on("warning", error => {
            reject(error);
        });

        // catch errors
        archive.on("error", error => {
            reject(error);
        });

        // pipe archive data to the file
        archive.pipe(output);

        // add files to root folder
        archive.file(config.readmePath, { name: `readme.txt` });
        archive.file(config.licensePath, { name: `license.txt` });

        // map array and append each icon to the respective folder
        iconArray.forEach((item: string) => {
            archive.append(fs.createReadStream(`${sourcePath}//${item}//${item}.ai`), {
                name: `Illustrator (AI)/${item}.ai`
            });
            archive.append(fs.createReadStream(`${sourcePath}//${item}//${item}.png`), {
                name: `High-resolution raster image (PNG)/${item}.png`
            });
            archive.append(fs.createReadStream(`${sourcePath}//${item}//${item}.svg`), {
                name: `Scalable vector graphic (SVG)/${item}.svg`
            });
        });

        // finalize it and save it
        archive.finalize();
    });
}
