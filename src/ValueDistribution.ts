export class ValueDistribution {

    private _offset: number;

    readonly probabilities: number[];

    get minValue() : number { return 1 + this._offset; }
    get maxValue() : number { return this.probabilities.length + this._offset; }

    constructor(probabilities: number[], offset: number = 0) {
        this.probabilities = probabilities;
        this._offset = offset;
    }

    probabilityForValue(value:number) : number {
        return this.probabilities[value + 1 + this._offset];
    }
};