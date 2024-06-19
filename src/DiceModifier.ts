/**
 *  This class represents a modifier that can
 *  be applied on a dice.
 */
export interface DiceModifier {

    /**
     *  Modify the result of the dice.
     */
    modify(result: number) : number;

    /**
     *  Get the string representation of the modifier.
     */
    toString() : string;
};
