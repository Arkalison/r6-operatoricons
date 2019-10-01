import generateIcons from "./modules/generateIcons";
import buildIconJson from "./modules/buildIconJson";

import ops from "../operators.json";

async function main() {
    await generateIcons(ops);
    await buildIconJson(ops);
}

main().catch(error => {
    console.log(error);
    process.exit(1);
});
