import { Dice } from "./Dice";
import { DiceLike } from "./DiceLike";
import { fixNumber } from "./fixNumber";
import { ValueDistribution } from "./ValueDistribution";

/**
 *  Disadvantage dice is when you can roll two dice and take the lower value.
 */
export class DisadvantageDice implements DiceLike {

    private _dice: Dice;

    get sides(): number { return this._dice.sides; }

    constructor(dice: Dice) {
        this._dice = dice;
    }

    /**
     *  The possible values the dice can roll.
     */
    possibleValues(): number[] {
        return this._dice.possibleValues();
    }

    roll(): number {
        const resultA = this._dice.roll();
        const resultB = this._dice.roll();
        return resultA < resultB ? resultA : resultB;
    }

    /**
     *  Probability of rolling a value equal to passed value.
     */
    probabilityFor(x: number) : number {
        const baseProbability = this._dice.probabilityFor(x);

        // A probability for a specific value is a sum of 3 probabilities:
        // - same value on both dice (baseProbability * baseProbability)
        // - target value on dice A and higher value on dice B (baseProbability * this._dice.probabilityForHigher(x))
        // - target value on dice B and higher value on dice A (baseProbability * this._dice.probabilityForHigher(x))
        return fixNumber(2 * (baseProbability * this._dice.probabilityForHigher(x)) + baseProbability * baseProbability);
    }

    /**
     *  Probability of rolling a value higher to passed value.
     */
    probabilityForHigher(x: number): number {
        
        // Probability of rolling a value higher to passed value is a sum of:
        // - probability of rolling a value higher than the target value on both dice
        return fixNumber(
            this._dice.probabilityForHigher(x) * this._dice.probabilityForHigher(x)
        )
    }

    /**
     *  Probability of rolling a value lower to passed value.
     */
    probabilityForLower(x: number): number {
    
        // Probability of rolling a value lower to passed value is a sum of:
        // - probability of rolling a value lower than the target value on both dice
        // - probability of rolling a value lower on dice A and higher on dice B
        // - probability of rolling a value lower on dice B and higher on dice A
        // - probability of rolling a value lower on dice A and equal on dice B
        // - probability of rolling a value lower on dice B and equal on dice A
        return fixNumber(
            this._dice.probabilityForLower(x) * this._dice.probabilityForLower(x) +
            this._dice.probabilityForLower(x) * this._dice.probabilityForHigher(x) +
            this._dice.probabilityForLower(x) * this._dice.probabilityForHigher(x) +
            this._dice.probabilityForLower(x) * this._dice.probabilityForLower(x) +
            this._dice.probabilityForLower(x) * this._dice.probabilityForLower(x)
        )
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
        return `${this._dice.toString()}D`;
    }
}