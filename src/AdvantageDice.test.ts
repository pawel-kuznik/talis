import { AdvantageDice } from "./AdvantageDice";
import { Dice } from "./Dice";

describe('AdvantageDice', () => {
    it('should roll in a range of sides', () => {
        const d = new AdvantageDice(new Dice(6));

        for (let i = 0; i < 100; i++) {
            const result = d.roll();
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(d.sides);
        }
    });

    it('should convert to string version', () => {
        const d6 = new AdvantageDice(new Dice(6));
        expect(d6.toString()).toEqual("d6A");
    });

    it('should give a correct distribution for a d4', () => {
        const d4 = new AdvantageDice(new Dice(4));
        const probabilities = d4.probabilities();

        expect(probabilities.minValue).toEqual(1);
        expect(probabilities.maxValue).toEqual(4);
        expect(probabilities.probabilities.length).toEqual(4);

        // For advantage dice, the probability of getting a value n is:
        // P(n) = (2n-1)/n²
        // For d4, this gives us:
        // P(1) = 1/16
        // P(2) = 3/16
        // P(3) = 5/16
        // P(4) = 7/16
        expect(probabilities.probabilities[0]).toBeCloseTo(1/16, 5);
        expect(probabilities.probabilities[1]).toBeCloseTo(3/16, 5);
        expect(probabilities.probabilities[2]).toBeCloseTo(5/16, 5);
        expect(probabilities.probabilities[3]).toBeCloseTo(7/16, 5);

        expect(probabilities.total).toEqual(1);
    });

    it('should give a correct distribution for a d6', () => {
        const d6 = new AdvantageDice(new Dice(6));
        const probabilities = d6.probabilities();

        expect(probabilities.minValue).toEqual(1);
        expect(probabilities.maxValue).toEqual(6);
        expect(probabilities.probabilities.length).toEqual(6);

        // For d6, the probabilities are:
        // P(1) = 1/36
        // P(2) = 3/36
        // P(3) = 5/36
        // P(4) = 7/36
        // P(5) = 9/36
        // P(6) = 11/36
        expect(probabilities.probabilities[0]).toBeCloseTo(1/36, 5);
        expect(probabilities.probabilities[1]).toBeCloseTo(3/36, 5);
        expect(probabilities.probabilities[2]).toBeCloseTo(5/36, 5);
        expect(probabilities.probabilities[3]).toBeCloseTo(7/36, 5);
        expect(probabilities.probabilities[4]).toBeCloseTo(9/36, 5);
        expect(probabilities.probabilities[5]).toBeCloseTo(11/36, 5);

        expect(probabilities.total).toEqual(1);
    });

    it('should give a correct distribution for a d20', () => {
        const d20 = new AdvantageDice(new Dice(20));
        const probabilities = d20.probabilities();

        expect(probabilities.minValue).toEqual(1);
        expect(probabilities.maxValue).toEqual(20);
        expect(probabilities.probabilities.length).toEqual(20);

        // For d20, the probabilities follow the same pattern:
        // P(n) = (2n-1)/400
        // Let's verify a few key values:
        expect(probabilities.probabilities[0]).toBeCloseTo(1/400, 5);  // P(1)
        expect(probabilities.probabilities[9]).toBeCloseTo(19/400, 5); // P(10)
        expect(probabilities.probabilities[19]).toBeCloseTo(39/400, 5); // P(20)

        expect(probabilities.total).toEqual(1);
    });

    it('should return correct possible values', () => {
        const d6 = new AdvantageDice(new Dice(6));
        const possibleValues = d6.possibleValues();
        
        expect(possibleValues).toEqual([1, 2, 3, 4, 5, 6]);
        expect(possibleValues.length).toEqual(6);
    });
});
