import Operator from "./modules/operator";
import operatorData from "../operators.json";

// type definition
type OperatorObject = {
    [key in keyof typeof operatorData]: ReturnType<typeof Operator>;
};

const output = Object.keys(operatorData)
    .map(op => Operator(op, operatorData[op]))
    .reduce(
        (object, op) => {
            // eslint-disable-next-line no-param-reassign
            object[op.id] = op;
            return object;
        },
        {} as OperatorObject // set type for the object created by reduce
    );

export default output;
