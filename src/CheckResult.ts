
/**
 *  This is a class describing a check result.
 */
export class CheckResult {

    /**
     *  The raw value of the roll.
     */
    public readonly value: number;

    /**
     *  The number of critical successes according to the check.
     */
    public readonly criticalSuccesses: number;

    /**
     *  The number of successes according to the check.
     */
    public readonly successes: number;

    /**
     *  The number of failures according to the check.
     */
    public readonly failure: number;

    /**
     *  The number of critical failures according to the check.
     */
    public readonly criticalFailure: number;

    constructor(value: number, criticalSuccesses: number = 0, successes: number = 0, failure: number = 0, criticalFailure: number = 0) {
        this.value = value;
        this.criticalSuccesses = criticalSuccesses;
        this.successes = successes;
        this.failure = failure;
        this.criticalFailure = criticalFailure;
    }
}