import { Dice } from "./Dice";
import { DiceLike } from "./DiceLike";
import { fixNumber } from "./fixNumber";
import { ValueDistribution } from "./ValueDistribution";

/**
 *  Advantage dice is when you can roll two dice and take the higher value.
 */
export class AdvantageDice implements DiceLike {

    private _dice: Dice;

    get sides(): number { return this._dice.sides; }

    constructor(dice: Dice) {
        this._dice = dice;
    }
    
    roll(): number {
        const resultA = this._dice.roll();
        const resultB = this._dice.roll();
        return resultA > resultB ? resultA : resultB;
    }

    /**
     *  Probability of rolling a value equal to passed value.
     */
    probabilityFor(x: number) : number {
        const baseProbability = this._dice.probabilityFor(x);

        // A probablity for a specific value is a sum of 3 probabilities:
        // - same value on both dice (baseProbability * baseProbability)
        // - target balue on dice A and lower value on dice B (baseProbability * this._dice.probabilityForLower(x))
        // - target value on dice B and lower value on dice A (baseProbability * this._dice.probabilityForLower(x))
        return fixNumber(2 * (baseProbability * this._dice.probabilityForLower(x)) + baseProbability * baseProbability);
    }

    /**
     *  Probability of rolling a value higher to passed value.
     */
    probabilityForHigher(x: number): number {

        // A profor a result higher than a specific value is a sum of:
        // - probability of rolling a value higher than the target value on both dice
        // - probability of rolling a value higher on dice A and equal on dice B
        // - probability of rolling a value higher on dice B and equal on dice A
        // - probability of rolling a value higher on dice A and lower on dice B
        // - probability of rolling a value higher on dice B and lower on dice A
        return fixNumber(
            this._dice.probabilityForHigher(x) * this._dice.probabilityForHigher(x) +
            this._dice.probabilityForHigher(x) * this._dice.probabilityFor(x) +
            this._dice.probabilityForHigher(x) * this._dice.probabilityFor(x) +
            this._dice.probabilityForHigher(x) * this._dice.probabilityForLower(x) +
            this._dice.probabilityForHigher(x) * this._dice.probabilityForLower(x)
        );
    }

    /**
     *  Probability of rolling a value lower to passed value.
     */
    probabilityForLower(x: number): number {

        // A profor a result higher than a specific value is a sum of:
        // - probability of rolling a value lower than the target value on both dice
        return fixNumber(
            this._dice.probabilityForLower(x) * this._dice.probabilityForLower(x)
        );
    }

    /**
     *  Get probabilities of values.
     */
    probabilities(): ValueDistribution {
        const result = Array(this._dice.sides).fill(0);

        for(let idx = 0; idx < result.length; idx++) {
            result[idx] = this.probabilityFor(idx + 1);
        }

        return new ValueDistribution(result);
    }

    toString(): string {
        return `${this._dice.toString()}A`;
    }
}