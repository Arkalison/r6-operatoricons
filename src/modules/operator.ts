import cheerio from "cheerio";

import iconData from "../../dist/icons.json";
import IOperator from "../interfaces/operator";

// extend interface with icon object
interface Operator extends IOperator {
    icon: {
        svg: string;
        attributes: {
            [key: string]: unknown;
        };
    };
}

export default function Operator(id: string, contents: IOperator): Operator {
    // get attributes + values of the SVG string
    const $ = cheerio.load(`${iconData[id]}`);
    const attributes = {
        ...$("svg").get(0).attribs,
        ...{ class: `r6operators r6operators-${id}` }
    };
    // create new icon object
    const icon = {
        svg: $("svg").html(),
        attributes
    };

    return {
        id,
        ...contents,
        icon
    };
}
