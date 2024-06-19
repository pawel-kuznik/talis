import { Dice } from "./Dice";
import { DiceLike } from "./DiceLike";
import { ValueDistribution } from "./ValueDistribution";

export class AdvanatageDice implements DiceLike {

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

    probabilities(): ValueDistribution {

        const result = Array(this._dice.sides).fill(0);

        for(let idx = 0; idx < result.length; idx++) {
            
        }

        return new ValueDistribution(result);
    }

    toString(): string {
        return `${this._dice.toString()}!`;
    }
}