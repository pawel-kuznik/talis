import { ThresholdCheck } from "./ThresholdCheck";
import { Dice } from "./Dice";
import { CheckResult } from "./CheckResult";

describe('ThresholdCheck', () => {
    it('should perform check and return CheckResult', () => {
        const check = new ThresholdCheck({
            threshold: 10,
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

    it('should determine correct results for higher-is-better threshold', () => {
        const check = new ThresholdCheck({
            threshold: 10,
            higherBetter: true,
            criticalSuccesses: [20],
            criticalFailures: [1]
        });
        
        // Critical success
        const criticalResult = check.determineResult(20);
        expect(criticalResult.value).toEqual(20);
        expect(criticalResult.criticalSuccesses).toEqual(1);
        expect(criticalResult.successes).toEqual(0);
        expect(criticalResult.failure).toEqual(0);
        expect(criticalResult.criticalFailure).toEqual(0);

        // Critical failure
        const criticalFailureResult = check.determineResult(1);
        expect(criticalFailureResult.value).toEqual(1);
        expect(criticalFailureResult.criticalSuccesses).toEqual(0);
        expect(criticalFailureResult.successes).toEqual(0);
        expect(criticalFailureResult.failure).toEqual(0);
        expect(criticalFailureResult.criticalFailure).toEqual(1);

        // Regular success
        const successResult = check.determineResult(15);
        expect(successResult.value).toEqual(15);
        expect(successResult.criticalSuccesses).toEqual(0);
        expect(successResult.successes).toEqual(1);
        expect(successResult.failure).toEqual(0);
        expect(successResult.criticalFailure).toEqual(0);

        // Regular failure
        const failureResult = check.determineResult(5);
        expect(failureResult.value).toEqual(5);
        expect(failureResult.criticalSuccesses).toEqual(0);
        expect(failureResult.successes).toEqual(0);
        expect(failureResult.failure).toEqual(1);
        expect(failureResult.criticalFailure).toEqual(0);

        // Edge case: exact threshold should be success
        const thresholdResult = check.determineResult(10);
        expect(thresholdResult.successes).toEqual(1);
        expect(thresholdResult.failure).toEqual(0);
    });

    it('should determine correct results for lower-is-better threshold', () => {
        const check = new ThresholdCheck({
            threshold: 10,
            higherBetter: false,
            criticalSuccesses: [1],
            criticalFailures: [20]
        });
        
        // Critical success
        const criticalResult = check.determineResult(1);
        expect(criticalResult.criticalSuccesses).toEqual(1);
        expect(criticalResult.successes).toEqual(0);

        // Regular success (low value)
        const successResult = check.determineResult(5);
        expect(successResult.successes).toEqual(1);
        expect(successResult.failure).toEqual(0);

        // Regular failure (high value)
        const failureResult = check.determineResult(15);
        expect(failureResult.failure).toEqual(1);
        expect(failureResult.successes).toEqual(0);

        // Edge case: exact threshold should be success
        const thresholdResult = check.determineResult(10);
        expect(thresholdResult.successes).toEqual(1);
        expect(thresholdResult.failure).toEqual(0);
    });

    it('should calculate correct success probabilities', () => {
        const check = new ThresholdCheck({
            threshold: 10,
            higherBetter: true,
            criticalSuccesses: [20],
            criticalFailures: [1]
        });
        const dice = new Dice(20);
        
        // For d20 with threshold 10 (higher better):
        // Success on: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
        // That's 11 out of 20 values = 11/20 = 0.55
        const probability = check.probabilityForSuccess(dice);
        expect(probability).toBeCloseTo(11/20, 5);
    });

    it('should calculate correct failure probabilities', () => {
        const check = new ThresholdCheck({
            threshold: 10,
            higherBetter: true,
            criticalSuccesses: [20],
            criticalFailures: [1]
        });
        const dice = new Dice(20);
        
        // For d20 with threshold 10 (higher better):
        // Failure on: 1, 2, 3, 4, 5, 6, 7, 8, 9
        // That's 9 out of 20 values = 9/20 = 0.45
        const probability = check.probabilityForFailure(dice);
        expect(probability).toBeCloseTo(9/20, 5);
    });

    it('should calculate correct probabilities for specific success counts', () => {
        const check = new ThresholdCheck({
            threshold: 10,
            higherBetter: true,
            criticalSuccesses: [20],
            criticalFailures: [1]
        });
        const dice = new Dice(20);
        
        // For basic threshold check, we can only have 0 or 1 success
        expect(check.probabilityForSuccess(dice, 0)).toBeCloseTo(9/20, 5); // Same as failure probability
        expect(check.probabilityForSuccess(dice, 1)).toBeCloseTo(11/20, 5); // Same as success probability
        expect(check.probabilityForSuccess(dice, 2)).toBeCloseTo(0, 5); // Impossible
    });

    it('should handle default options correctly', () => {
        const check = new ThresholdCheck({
            threshold: 10,
            higherBetter: undefined, // Should default to true
            criticalSuccesses: undefined, // Should default to []
            criticalFailures: undefined  // Should default to []
        });
        
        // Test with a value that would be critical if lists weren't empty
        const result = check.determineResult(1);
        expect(result.criticalFailure).toEqual(0); // Should be regular failure
        expect(result.failure).toEqual(1);
        
        const result20 = check.determineResult(20);
        expect(result20.criticalSuccesses).toEqual(0); // Should be regular success
        expect(result20.successes).toEqual(1);
    });

    it('should handle multiple critical values', () => {
        const check = new ThresholdCheck({
            threshold: 10,
            higherBetter: true,
            criticalSuccesses: [19, 20],
            criticalFailures: [1, 2]
        });
        
        expect(check.determineResult(19).criticalSuccesses).toEqual(1);
        expect(check.determineResult(20).criticalSuccesses).toEqual(1);
        expect(check.determineResult(1).criticalFailure).toEqual(1);
        expect(check.determineResult(2).criticalFailure).toEqual(1);
    });
});