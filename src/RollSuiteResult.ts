export class RollSuiteResult {

    private _results: { [ roll: number ]: number };
    
    readonly rolls: number[];
    readonly maxRoll: number;
    readonly minRoll: number;

    constructor(input: { [ roll: number ]: number }) {
        this._results = input;

        this.rolls = Object.keys(input).map(Number);
        this.maxRoll = Math.max(...this.rolls);
        this.minRoll = Math.min(...this.rolls);
    }

    getOccurences(roll: number) : number {

        return this.rolls.includes(roll) ? this._results[roll] : 0;
    }
};
