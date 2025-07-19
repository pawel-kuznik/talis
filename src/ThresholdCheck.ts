import { CheckLike } from "./CheckLike";
import { CheckResult } from "./CheckResult";
import { DiceLike } from "./DiceLike";

export interface ThresholdCheckOptions {
    /**
     *  Which values should be consider critical failures?
     *  @default []
     */
    criticalFailures: number[];

    /**
     *  Which values should be consider critical successes?
     *  @default []
     */
    criticalSuccesses: number[];

    /**
     *  Which values should be consider as passing values? 
     */
    threshold: number;

    /**
     *  Are higher values than the passed threshold better and count
     *  as passes?
     *  @default true
     */
    higherBetter: boolean; 
} 

/**
 *  This is a check that checks a roll of a dice against a specific threshold.
 *  The threshold is a flat value passed in the constructor.
 */
export class ThresholdCheck implements CheckLike {

    protected options: ThresholdCheckOptions;

    constructor(options: ThresholdCheckOptions) {
        this.options = {
            criticalFailures: options.criticalFailures || [],
            criticalSuccesses: options.criticalSuccesses || [],
            threshold: options.threshold,
            higherBetter: options.higherBetter !== undefined ? options.higherBetter : true
        };
    }

    /**
     *  Perform the check. The roll of a dice is compared against
     *  the internal logic. The result is a specialized object that
     *  tell how many successes or failures was in the check result.
     */
    roll(dice: DiceLike): CheckResult {
        const rollValue = dice.roll();
        return this.determineResult(rollValue);
    }

    /**
     *  Determine a result based on raw passed value.
     */
    determineResult(result: number): CheckResult {
        let criticalSuccesses = 0;
        let successes = 0;
        let failures = 0;
        let criticalFailures = 0;

        // Check for critical successes first
        if (this.options.criticalSuccesses.includes(result)) {
            criticalSuccesses = 1;
        }
        // Check for critical failures
        else if (this.options.criticalFailures.includes(result)) {
            criticalFailures = 1;
        }
        // Check for regular success/failure based on threshold
        else {
            const isSuccess = this.options.higherBetter ? result >= this.options.threshold : result <= this.options.threshold;
            if (isSuccess) {
                successes = 1;
            } else {
                failures = 1;
            }
        }

        return new CheckResult(result, criticalSuccesses, successes, failures, criticalFailures);
    }

    /**
     *  The probability to pass a check.
     */
    probabilityForSuccess(dice: DiceLike, successes?: number): number {
        if (successes !== undefined) {
            // For basic threshold check, we either have 0 or 1 success
            if (successes === 0) {
                return this.probabilityForFailure(dice);
            } else if (successes === 1) {
                return this.probabilityForSuccess(dice);
            } else {
                return 0; // Cannot have more than 1 success in basic threshold check
            }
        }

        let probability = 0;
        for (const value of dice.possibleValues()) {
            const result = this.determineResult(value);
            if (result.successes > 0 || result.criticalSuccesses > 0) {
                probability += dice.probabilityFor(value);
            }
        }
        return probability;
    }

    /**
     *  Probability to fail a check.
     */
    probabilityForFailure(dice: DiceLike, failures?: number): number {
        if (failures !== undefined) {
            // For basic threshold check, we either have 0 or 1 failure
            if (failures === 0) {
                return this.probabilityForSuccess(dice);
            } else if (failures === 1) {
                return this.probabilityForFailure(dice);
            } else {
                return 0; // Cannot have more than 1 failure in basic threshold check
            }
        }

        let probability = 0;
        for (const value of dice.possibleValues()) {
            const result = this.determineResult(value);
            if (result.failure > 0 || result.criticalFailure > 0) {
                probability += dice.probabilityFor(value);
            }
        }
        return probability;
    }
}