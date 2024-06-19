import { ValueDistribution } from "./ValueDistribution";

export interface DiceLike {
    sides: number;
    roll(): number;
    probabilities() : ValueDistribution;
    toString() : string;
};