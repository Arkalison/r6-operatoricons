import generateIcons from "./modules/generateIcons";
import buildIconJson from "./modules/buildIconJson";
import buildIconPackage from "./modules/buildIconPackage";

import ops from "../src/operators.json";

async function main() {
    // generate all icon files (SVG, PNG, ZIP)
    await generateIcons(ops);
    // build icons.json for icon class
    await buildIconJson(ops);
    // generate icon package
    await buildIconPackage(ops);
}

main().catch(error => {
    console.log(error);
    process.exit(1);
});
