import { Dice } from "./Dice";
import { DiceLike } from "./DiceLike";
import { ValueDistribution } from "./ValueDistribution";

/**
 *  This is a class representing a modified dice. A modified dice
 *  a regular dice + a modification of the output.
 */
export class ModifiedDice implements DiceLike {
    
    private _dice: Dice;
    private _modifier: number;

    constructor(sides: number, modifier: number) {
        
        this._dice = new Dice(sides);
        this._modifier = modifier;
    }

    get sides() : number { return this._dice.sides; };

    probabilities(): ValueDistribution {

        const raw = Array(this.sides).fill(0).map((() => 1 / this.sides));

        return new ValueDistribution(raw, this._modifier);
    }

    roll(): number {
        return this._dice.roll() + this._modifier;
    }

    toString(): string {
        return `${this._dice.toString()}${this._modifier >= 0 ? "+" : "-"}${Math.abs(this._modifier)}`;
    }
};
