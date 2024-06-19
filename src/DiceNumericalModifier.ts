import { DiceModifier } from "./DiceModifier";

export class DiceNumericalModifier implements DiceModifier {

    readonly modification: number;

    constructor(modification: number) {

        this.modification = modification;
    }

    modify(result: number): number {
        return result + this.modification;
    }

    toString(): string {
        if (this.modification < 0) return `-${Math.abs(this.modification)}`;
        return `+${Math.abs(this.modification)}`;
    }
};
