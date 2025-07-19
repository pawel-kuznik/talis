import { SteppingThresholdCheck } from "./SteppingThresholdCheck";
import { Dice } from "./Dice";
import { CheckResult } from "./CheckResult";

describe('SteppingThresholdCheck', () => {
    it('should perform check and return CheckResult', () => {
        const check = new SteppingThresholdCheck({
            threshold: 10,
            step: 5,
            higherBetter: true,
            criticalSuccesses: [20],
            criticalFailures: [1]
        });
        const dice = new Dice(20);
        const result = check.roll(dice);
        
        expect(result).toBeInstanceOf(CheckResult);
        expect(result.value).toBeGreaterThanOrEqual(1);
        expect(result.value).toBeLessThanOrEqual(20);
    });

    it('should determine correct results with stepping for higher-is-better', () => {
        const check = new SteppingThresholdCheck({
            threshold: 10,
            step: 5,
            higherBetter: true,
            criticalSuccesses: [20],
            criticalFailures: [1]
        });
        
        // Critical success (should override stepping)
        const criticalResult = check.determineResult(20);
        expect(criticalResult.criticalSuccesses).toEqual(1);
        expect(criticalResult.successes).toEqual(0);

        // Critical failure (should override stepping)
        const criticalFailureResult = check.determineResult(1);
        expect(criticalFailureResult.criticalFailure).toEqual(1);
        expect(criticalFailureResult.successes).toEqual(0);

        // Base success (exactly at threshold)
        const baseResult = check.determineResult(10);
        expect(baseResult.successes).toEqual(1); // 1 + floor((10-10)/5) = 1 + 0 = 1
        expect(baseResult.failure).toEqual(0);

        // One step success (threshold + step)
        const oneStepResult = check.determineResult(15);
        expect(oneStepResult.successes).toEqual(2); // 1 + floor((15-10)/5) = 1 + 1 = 2
        expect(oneStepResult.failure).toEqual(0);

        // Two step success
        const twoStepResult = check.determineResult(20);  // This will be critical, so let's use 19
        const almostTwoStepResult = check.determineResult(19);
        expect(almostTwoStepResult.successes).toEqual(2); // 1 + floor((19-10)/5) = 1 + 1 = 2

        // Partial step (should not count as additional success)
        const partialStepResult = check.determineResult(14);
        expect(partialStepResult.successes).toEqual(1); // 1 + floor((14-10)/5) = 1 + 0 = 1

        // Failure
        const failureResult = check.determineResult(5);
        expect(failureResult.failure).toEqual(1);
        expect(failureResult.successes).toEqual(0);
    });

    it('should determine correct results with stepping for lower-is-better', () => {
        const check = new SteppingThresholdCheck({
            threshold: 10,
            step: 3,
            higherBetter: false,
            criticalSuccesses: [1],
            criticalFailures: [20]
        });
        
        // Critical success (should override stepping)
        const criticalResult = check.determineResult(1);
        expect(criticalResult.criticalSuccesses).toEqual(1);
        expect(criticalResult.successes).toEqual(0);

        // Base success (exactly at threshold)
        const baseResult = check.determineResult(10);
        expect(baseResult.successes).toEqual(1); // 1 + floor((10-10)/3) = 1 + 0 = 1

        // One step success (threshold - step)
        const oneStepResult = check.determineResult(7);
        expect(oneStepResult.successes).toEqual(2); // 1 + floor((10-7)/3) = 1 + 1 = 2

        // Two step success (threshold - 2*step)
        const twoStepResult = check.determineResult(4);
        expect(twoStepResult.successes).toEqual(3); // 1 + floor((10-4)/3) = 1 + 2 = 3

        // Partial step (should not count as additional success)
        const partialStepResult = check.determineResult(8);
        expect(partialStepResult.successes).toEqual(1); // 1 + floor((10-8)/3) = 1 + 0 = 1

        // Failure
        const failureResult = check.determineResult(15);
        expect(failureResult.failure).toEqual(1);
        expect(failureResult.successes).toEqual(0);
    });

    it('should calculate correct probabilities for specific success counts', () => {
        const check = new SteppingThresholdCheck({
            threshold: 10,
            step: 5,
            higherBetter: true,
            criticalSuccesses: [20],
            criticalFailures: [1]
        });
        const dice = new Dice(20);
        
        // Count values that give exactly 1 success:
        // Values 10, 11, 12, 13, 14, 20 give 1 success (6 values)
        // Note: 20 is critical success, and 15-19 give 2 successes
        expect(check.probabilityForSuccess(dice, 1)).toBeCloseTo(6/20, 5);

        // Count values that give exactly 2 successes:
        // Values 15, 16, 17, 18, 19 give 2 successes (5 values)
        expect(check.probabilityForSuccess(dice, 2)).toBeCloseTo(5/20, 5);

        // Count values that give exactly 0 successes:
        // Values 1, 2, 3, 4, 5, 6, 7, 8, 9 give 0 successes (9 values)
        expect(check.probabilityForSuccess(dice, 0)).toBeCloseTo(9/20, 5);

        // No values give 3 regular successes in this setup
        expect(check.probabilityForSuccess(dice, 3)).toBeCloseTo(0, 5);
    });

    it('should calculate correct probabilities for specific failure counts', () => {
        const check = new SteppingThresholdCheck({
            threshold: 10,
            step: 5,
            higherBetter: true,
            criticalSuccesses: [20],
            criticalFailures: [1]
        });
        const dice = new Dice(20);
        
        // Count values that give exactly 1 failure:
        // Values 2, 3, 4, 5, 6, 7, 8, 9 give 1 regular failure (8 values)
        // Value 1 gives 1 critical failure (1 value)
        // Total: 9 values that result in exactly 1 failure (regular or critical)
        expect(check.probabilityForFailure(dice, 1)).toBeCloseTo(9/20, 5);

        // Count values that give exactly 0 failures:
        // Values 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 give 0 failures (11 values)
        expect(check.probabilityForFailure(dice, 0)).toBeCloseTo(11/20, 5);
    });

    it('should handle default step value', () => {
        const check = new SteppingThresholdCheck({
            threshold: 10,
            step: undefined, // Should default to 1
            higherBetter: true,
            criticalSuccesses: [],
            criticalFailures: []
        });
        
        // With step = 1, each point above threshold should give one additional success
        const result11 = check.determineResult(11);
        expect(result11.successes).toEqual(2); // 1 + floor((11-10)/1) = 2

        const result15 = check.determineResult(15);
        expect(result15.successes).toEqual(6); // 1 + floor((15-10)/1) = 6
    });

    it('should inherit basic threshold behavior when no stepping occurs', () => {
        const check = new SteppingThresholdCheck({
            threshold: 10,
            step: 100, // Very large step, so no additional successes
            higherBetter: true,
            criticalSuccesses: [],
            criticalFailures: []
        });
        
        // Should behave like basic threshold check
        const result10 = check.determineResult(10);
        expect(result10.successes).toEqual(1);

        const result19 = check.determineResult(19);
        expect(result19.successes).toEqual(1); // No additional step reached

        const result5 = check.determineResult(5);
        expect(result5.failure).toEqual(1);
        expect(result5.successes).toEqual(0);
    });

    it('should handle edge case calculations correctly', () => {
        const check = new SteppingThresholdCheck({
            threshold: 10,
            step: 3,
            higherBetter: true,
            criticalSuccesses: [],
            criticalFailures: []
        });
        
        // Test edge cases around step boundaries
        expect(check.determineResult(10).successes).toEqual(1);  // Base
        expect(check.determineResult(12).successes).toEqual(1);  // Just under next step
        expect(check.determineResult(13).successes).toEqual(2);  // Exactly one step
        expect(check.determineResult(15).successes).toEqual(2);  // Just under two steps
        expect(check.determineResult(16).successes).toEqual(3);  // Exactly two steps
    });
});