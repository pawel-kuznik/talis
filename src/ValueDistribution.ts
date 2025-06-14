import { fixNumber } from "./fixNumber";

/**
 *  This class represents a distribution of values. It's used to represent the
 *  distribution of values of a dice.
 */
export class ValueDistribution {

    private _offset: number;

    readonly probabilities: number[];

    get minValue() : number { return 1 + this._offset; }
    get maxValue() : number { return this.probabilities.length + this._offset; }

    get total() : number { return fixNumber(this.probabilities.reduce((acc, curr) => acc + curr, 0)); }

    constructor(probabilities: number[], offset: number = 0) {
        this.probabilities = probabilities;
        this._offset = offset;
    }

    probabilityForValue(value:number) : number {
        return this.probabilities[value + 1 + this._offset];
    }
};