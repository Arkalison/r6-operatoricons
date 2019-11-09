/* eslint-disable unicorn/consistent-function-scoping */
import cheerio from "cheerio";
import classnames from "classnames";

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

/**
 * Convert attributes object to string of HTML attributes.
 * @param {Object} attributes - Object containing the attributes.
 * @returns {string}
 */
function attributesToString(attributes) {
    return Object.keys(attributes)
        .map(key => `${key}="${attributes[key]}"`)
        .join(" ");
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

    function toSVG(userAttributes) {
        // create an object containing all attributes from the icon + user attributes
        const combinedAttributes = {
            ...this.icon.attributes,
            ...userAttributes,
            ...{
                class: classnames(
                    this.icon.attributes.class,
                    userAttributes === undefined ? "" : userAttributes.class
                )
            }
        };
        // return as a SVG string
        return `<svg ${attributesToString(combinedAttributes)}>${
            this.icon.svg
        }</svg>`;
    }

    return {
        id,
        ...contents,
        icon,
        toSVG
    };
}
