import { ThresholdCheck, ThresholdCheckOptions } from "./ThresholdCheck";
import { CheckLike } from "./CheckLike";
import { CheckResult } from "./CheckResult";
import { DiceLike } from "./DiceLike";

export interface  SteppingThresholdCheckOptions extends ThresholdCheckOptions {

    /**
     *  What is the step over the threshold that would count as additional successes?
     *  @default 1
     */
    step: number;
}

export class SteppingThresholdCheck extends ThresholdCheck implements CheckLike {

    private steppingOptions: SteppingThresholdCheckOptions;

    constructor(options: SteppingThresholdCheckOptions) {
        super(options);
        this.steppingOptions = {
            ...options,
            step: options.step !== undefined ? options.step : 1
        };
    }

    /**
     *  Determine a result based on raw passed value.
     *  In stepping threshold, each step over the threshold counts as additional successes.
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
        // Check for regular success/failure based on threshold with stepping
        else {
            const isSuccess = this.options.higherBetter ? result >= this.options.threshold : result <= this.options.threshold;
            if (isSuccess) {
                if (this.options.higherBetter) {
                    // Calculate number of successes based on how many steps over threshold
                    const stepsOver = Math.floor((result - this.options.threshold) / this.steppingOptions.step);
                    successes = 1 + stepsOver;
                } else {
                    // For lower-is-better, calculate steps under threshold
                    const stepsUnder = Math.floor((this.options.threshold - result) / this.steppingOptions.step);
                    successes = 1 + stepsUnder;
                }
            } else {
                failures = 1;
            }
        }

        return new CheckResult(result, criticalSuccesses, successes, failures, criticalFailures);
    }

    /**
     *  The probability to pass a check with a specific number of successes.
     */
    probabilityForSuccess(dice: DiceLike, successes?: number): number {
        if (successes !== undefined) {
            let probability = 0;
            for (const value of dice.possibleValues()) {
                const result = this.determineResult(value);
                const totalSuccesses = result.successes + result.criticalSuccesses;
                if (totalSuccesses === successes) {
                    probability += dice.probabilityFor(value);
                }
            }
            return probability;
        }

        // If no specific number of successes requested, return probability of any success
        return super.probabilityForSuccess(dice);
    }

    /**
     *  Probability to fail a check with a specific number of failures.
     */
    probabilityForFailure(dice: DiceLike, failures?: number): number {
        if (failures !== undefined) {
            let probability = 0;
            for (const value of dice.possibleValues()) {
                const result = this.determineResult(value);
                const totalFailures = result.failure + result.criticalFailure;
                if (totalFailures === failures) {
                    probability += dice.probabilityFor(value);
                }
            }
            return probability;
        }

        // If no specific number of failures requested, return probability of any failure
        return super.probabilityForFailure(dice);
    }
} 