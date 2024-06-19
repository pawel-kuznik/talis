import { DiceLike } from "./DiceLike";
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
    
    probabilities(): ValueDistribution {

        const raw = Array(this.sides).fill(0).map((() => 1 / this.sides));

        return new ValueDistribution(raw);
    }

    /**
     *  Roll the number of dice.
     */
    roll() : number {
        return 1 + (Math.random() % this.sides);
    }

    /**
     *  Get a string representation of a dice.
     */
    toString() {
        return `d${this.sides}`;
    }
};