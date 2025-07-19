import { DiceLike } from "./DiceLike";
import { fixNumber } from "./fixNumber";
import { ValueDistribution } from "./ValueDistribution";

/**
 *  This is a class that represents a dice. The dice can contain
 *  any number of sides, but these sides have to represent values
 *  between 1-N, where N is the number of sides on the die.
 */
export class Dice implements DiceLike {

    readonly sides: number;

    /**
     *  Construct a dice with N sides.
     */
    constructor(sides: number) {
        this.sides = sides;
    }
    
    /**
     *  Get probabilities of all values that a dice can produce.
     */
    probabilities(): ValueDistribution {

        const raw = Array(this.sides).fill(0).map(((_, idx) => this.probabilityFor(idx + 1)));

        return new ValueDistribution(raw);
    }

    /**
     *  Probability of rolling a value lower to passed value.
     */
    probabilityForLower(x: number) : number {
        if (x > this.sides) return 1;
        if (x < 1) return 0;
        const targetSides = x - 1;
        return fixNumber(targetSides / this.sides);
    }

    /**
     *  Probability of rolling a value higher to passed value.
     */
    probabilityForHigher(x: number) : number {
        const targetSides = this.sides - x;
        return fixNumber(targetSides / this.sides);
    }

    /**
     *  Probability of rolling a value equal to passed value.
     */
    probabilityFor(x: number) : number {
        if (x < 1 || x > this.sides) return 0;
        return fixNumber(1 / this.sides);
    }

    /**
     *  The possible values the dice can roll.
     */
    possibleValues(): number[] {
        return Array.from({length: this.sides}, (_, i) => i + 1);
    }

    /**
     *  Roll the number of dice.
     */
    roll() : number {
        return Math.floor(1 + (Math.random() * this.sides));
    }

    /**
     *  Get a string representation of a dice.
     */
    toString() {
        return `d${this.sides}`;
    }
};