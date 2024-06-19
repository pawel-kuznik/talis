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
     *  Get a string representation of a dice.
     */
    toString() : string;
};