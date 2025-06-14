import { DiceLike } from "./DiceLike";
import { fixNumber } from "./fixNumber";
import { RollSuiteResult } from "./RollSuiteResult";
import { ValueDistribution } from "./ValueDistribution";

/**
 *  This is a class that represents a set of rolls. This class
 *  is mostly to determine probability of specific complex results.
 */
export class RollSuite {

    private _dice: DiceLike;

    constructor(dice: DiceLike) {
        this._dice = dice;
    }

    /**
     *  Get probabilities of all values that a dice can produce.
     */
    probabilities(): ValueDistribution {
        return this._dice.probabilities();
    }

    /**
     *  Probability of rolling a value lower to passed value.
     */
    probabilityForLower(x: number) {
        return this._dice.probabilityForLower(x);
    }

    /**
     *  Probability of rolling a value higher to passed value.
     */
    probabilityForHigher(x: number) : number {
        return this._dice.probabilityForHigher(x);
    }

    /**
     *  Probability of rolling a value equal to passed value.
     */
    probabilityFor(x: number) : number {
        return this._dice.probabilityFor(x);
    }

    /**
     *  Roll the suite.
     */
    roll(): number {
        return this._dice.roll();
    }

    run(repeats: number = 1000) : RollSuiteResult {

        const result : { [ key: number ]: number } = { };
        
        for (let i = 0; i < repeats; i++) {

            const localResult = this.roll();

            if (!(localResult in result)) result[localResult] = 0;            
            result[localResult] += 1;
        }
        
        return new RollSuiteResult(result);
    }
}
