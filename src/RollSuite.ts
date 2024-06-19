import { DiceLike } from "./DiceLike";
import { RollSuiteResult } from "./RollSuiteResult";

/**
 *  This is a class that represents a set of rolls. This class
 *  is mostly to determine probability of specific complex results.
 */
export class RollSuite {

    private _dice: DiceLike;

    constructor(dice: DiceLike) {
        this._dice = dice;
    }

    run(repeats: number = 1000) : RollSuiteResult {

        const result : { [ key: number ]: number } = { };
        
        for (let i = 0; i < repeats; i++) {

            const localResult = this._dice.roll();

            if (!(localResult in result)) result[localResult] = 0;            
            result[localResult] += 1;
        }
        
        return new RollSuiteResult(result);
    }
}
