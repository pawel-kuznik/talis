import { ValueDistribution } from "./ValueDistribution";

/**
 *  This is an interface that describes an object that 
 *  behaves like a dice. In practice it will be either
 *  a dice or a modified dice.
 */
export interface DiceLike {

    /**
     *  Roll the dice and get one specific number.  
     */
    roll(): number;

    /**
     *  The possible values the dice can roll.
     */
    possibleValues() : number[]

    /**
     *  Get probabilities of all values that a dice can produce.
     */
    probabilities(): ValueDistribution;

    /**
     *  Probability of rolling a value equal to passed value.
     */
    probabilityFor(x: number) : number;

    /**
     *  Probability of rolling a value higher to passed value.
     */
    probabilityForHigher(x: number) : number;

    /**
     *  Probability of rolling a value lower to passed value.
     */
    probabilityForLower(x: number) : number

    /**
     *  Get a string representation of a dice.
     */
    toString() : string;
};