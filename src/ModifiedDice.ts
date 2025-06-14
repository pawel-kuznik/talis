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
     *  Get probabilities of all values that a dice can produce.
     */
    probabilities(): ValueDistribution {

        const raw = Array(this.sides).fill(0).map((() => 1 / this.sides));

        // @todo fix modifier
        return new ValueDistribution(raw, 0);
    }

    /**
     *  Probability of rolling a value equal to passed value.
     */
    probabilityFor(x: number) : number {

        // TODO: implement
        return 0;
    }

    /**
     *  Probability of rolling a value lower to passed value.
     */
    probabilityForLower(x: number) : number {

        // TODO: implement
        return 0;
    }

    /**
     *  Probability of rolling a value higher to passed value.
     */
    probabilityForHigher(x: number) : number {

        // TODO: implement
        return 0;
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
