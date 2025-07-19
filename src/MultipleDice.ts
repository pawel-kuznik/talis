import { Dice } from "./Dice";
import { DiceLike } from "./DiceLike";
import { ValueDistribution } from "./ValueDistribution";

export class MultipleDice implements DiceLike {

    private _dice: Dice;
    private _count: number;

    constructor(dice: Dice, count: number) {
        this._dice = dice;
        this._count = count;
    }

    /**
     *  The possible values the dice can roll.
     */
    possibleValues(): number[] {
        const minValue = this._count;
        const maxValue = this._count * this._dice.sides;
        return Array.from({length: maxValue - minValue + 1}, (_, i) => minValue + i);
    }

    /**
     *  Roll the dice.
     */
    roll(): number {
        let result = 0;
        for (let i = 0; i < this._count; i++) {
            result += this._dice.roll();
        }
        return result;
    }

    probabilities(): ValueDistribution {
        const minValue = this._count;
        const maxValue = this._count * this._dice.sides;
        const probabilities: number[] = [];

        for (let sum = minValue; sum <= maxValue; sum++) {
            probabilities.push(this.probabilityFor(sum));
        }

        return new ValueDistribution(probabilities, minValue - 1);
    }

    /**
     *  Probability of rolling a specific sum.
     *  Uses the formula: P(sum) = (1/s^n) * Σ(k=0 to floor((sum-n)/s)) (-1)^k * C(n,k) * C(sum-s*k-1, n-1)
     *  where s is the number of sides, n is the number of dice
     */
    probabilityFor(sum: number): number {
        if (sum < this._count || sum > this._count * this._dice.sides) {
            return 0;
        }

        const sides = this._dice.sides;
        const diceCount = this._count;
        let probability = 0;

        for (let k = 0; k <= Math.floor((sum - diceCount) / sides); k++) {
            const sign = Math.pow(-1, k);
            const combinations1 = this.binomialCoefficient(diceCount, k);
            const combinations2 = this.binomialCoefficient(sum - sides * k - 1, diceCount - 1);
            probability += sign * combinations1 * combinations2;
        }

        return probability / Math.pow(sides, diceCount);
    }

    /**
     *  Probability of rolling a sum higher than the given value.
     *  Uses the formula: P(sum > x) = 1 - P(sum ≤ x) = 1 - Σ(i=n to x) P(sum = i)
     *  where n is the number of dice
     */
    probabilityForHigher(sum: number): number {
        if (sum >= this._count * this._dice.sides) {
            return 0;
        }
        if (sum < this._count) {
            return 1;
        }

        let cumulativeProbability = 0;
        for (let i = this._count; i <= sum; i++) {
            cumulativeProbability += this.probabilityFor(i);
        }
        return 1 - cumulativeProbability;
    }

    /**
     *  Probability of rolling a sum lower than the given value.
     *  Uses the formula: P(sum < x) = Σ(i=n to x-1) P(sum = i)
     *  where n is the number of dice
     */
    probabilityForLower(sum: number): number {
        if (sum <= this._count) {
            return 0;
        }
        if (sum > this._count * this._dice.sides) {
            return 1;
        }

        let probability = 0;
        for (let i = this._count; i < sum; i++) {
            probability += this.probabilityFor(i);
        }
        return probability;
    }

    /**
     *  Calculate binomial coefficient C(n,k)
     */
    private binomialCoefficient(n: number, k: number): number {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;
        
        let result = 1;
        for (let i = 1; i <= k; i++) {
            result *= (n - (k - i));
            result /= i;
        }
        return result;
    }

    toString(): string {
        return `${this._count}${this._dice.toString()}`;
    }
}