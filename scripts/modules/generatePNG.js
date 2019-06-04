const path = require("path");
const sharp = require("sharp");

const config = require("../config.js");

// convert a single SVG file to an PNG
async function generatePNG(file, dest) {
    // set DPI and fileName
    const image = sharp(file, { density: 400 });
    const fileName = path.basename(file, path.extname(file));

    await new Promise((resolve, reject) => {
        image
            // get metadata from source file
            .metadata()
            .then(res => {
                // check if file is a valid SVG file
                if (res.format === "svg") {
                    image
                        .resize({ width: config.pngConfig.width, height: config.pngConfig.height }) // resize image
                        .png({ force: true }) // force PNG output
                        .toFile(dest + fileName + ".png")
                        .then(
                            res => {
                                // success
                                resolve(res);
                            },
                            rej => {
                                // fail
                                reject(rej);
                            }
                        )
                        // catch any errors on conversation
                        .catch(err => {
                            reject(err);
                        });
                } else {
                    // throw error if file is not a SVG
                    reject(new Error("File is not an SVG"));
                }
            })
            // catch unexpected errors
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = generatePNG;
