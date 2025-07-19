import { Dice } from "./Dice";
import { DiceLike } from "./DiceLike";
import { DiceModifier } from "./DiceModifier";
import { DiceNumericalModifier } from "./DiceNumericalModifier";
import { ValueDistribution } from "./ValueDistribution";

/**
 *  This is a class representing a modified dice. A modified dice
 *  a regular dice + a modification of the output.
 */
export class ModifiedDice implements DiceLike {
    
    private _dice: Dice;
    private _modifier: DiceModifier;

    constructor(dice: number|Dice, modifier: number|DiceModifier) {
        
        this._dice = typeof(dice) === "number" ?  new Dice(dice) : dice;
        this._modifier = typeof(modifier) === "number" ? new DiceNumericalModifier(modifier) : modifier;
    }

    get sides() : number { return this._dice.sides; };

    /**
     *  The possible values the dice can roll.
     */
    possibleValues(): number[] {
        return this._dice.possibleValues().map(value => this._modifier.modify(value));
    }

    /**
     *  Get probabilities of all values that a dice can produce.
     */
    probabilities(): ValueDistribution {
        const modifiedValues = this.possibleValues();
        const minValue = Math.min(...modifiedValues);
        const maxValue = Math.max(...modifiedValues);
        const probabilities: number[] = [];

        for (let value = minValue; value <= maxValue; value++) {
            probabilities.push(this.probabilityFor(value));
        }

        return new ValueDistribution(probabilities, minValue - 1);
    }

    /**
     *  Probability of rolling a value equal to passed value.
     */
    probabilityFor(x: number) : number {
        let probability = 0;
        for (const originalValue of this._dice.possibleValues()) {
            if (this._modifier.modify(originalValue) === x) {
                probability += this._dice.probabilityFor(originalValue);
            }
        }
        return probability;
    }

    /**
     *  Probability of rolling a value lower to passed value.
     */
    probabilityForLower(x: number) : number {
        let probability = 0;
        for (const originalValue of this._dice.possibleValues()) {
            if (this._modifier.modify(originalValue) < x) {
                probability += this._dice.probabilityFor(originalValue);
            }
        }
        return probability;
    }

    /**
     *  Probability of rolling a value higher to passed value.
     */
    probabilityForHigher(x: number) : number {
        let probability = 0;
        for (const originalValue of this._dice.possibleValues()) {
            if (this._modifier.modify(originalValue) > x) {
                probability += this._dice.probabilityFor(originalValue);
            }
        }
        return probability;
    }

    /**
     *  Roll the dice and get one specific number.
     */
    roll(): number {
        return this._modifier.modify(this._dice.roll());
    }

    /**
     *  Get a string representation of a dice.
     */
    toString(): string {
        return `${this._dice.toString()}${this._modifier.toString()}`;
    }
};
