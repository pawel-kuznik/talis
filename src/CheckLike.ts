import { CheckResult } from "./CheckResult";
import { DiceLike } from "./DiceLike";

/**
 *  This is an interface describing a check that should be performed
 *  with a specific dice.
 */
export interface CheckLike {

    /**
     *  Perform the check. The roll of a dice is compared against
     *  the internal logic. The result is a specialized object that
     *  tell how many successes or failures was in the check result.
     */
    roll(dice: DiceLike) : CheckResult;

    /**
     *  Determine a result based on raw passed value. 
     */
    determineResult(result: number) : CheckResult

    /**
     *  The probability to pass a chekc.
     */
    probabilityForSuccess(dice: DiceLike) : number; 

    /**
     *  The probability to pass a check with a number of successes.
     */
    probabilityForSuccess(dice: DiceLike, successes: number) : number; 

    /**
     *  Probability to fail a check.
     */
    probabilityForFailure(dice: DiceLike) : number;

    /**
     *  Probability to fail a check with a number of successes.
     */
    probabilityForFailure(dice: DiceLike, failures: number) : number;
}