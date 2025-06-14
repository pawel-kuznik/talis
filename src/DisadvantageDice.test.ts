import { DisadvantageDice } from "./DisadvantageDice";
import { Dice } from "./Dice";

describe('DisadvantageDice', () => {
    it('should roll in a range of sides', () => {
        const d = new DisadvantageDice(new Dice(6));

        for (let i = 0; i < 100; i++) {
            const result = d.roll();
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(d.sides);
        }
    });

    it('should convert to string version', () => {
        const d6 = new DisadvantageDice(new Dice(6));
        expect(d6.toString()).toEqual("d6D");
    });

    it('should give a correct distribution for a d4', () => {
        const d4 = new DisadvantageDice(new Dice(4));
        const probabilities = d4.probabilities();

        expect(probabilities.minValue).toEqual(1);
        expect(probabilities.maxValue).toEqual(4);
        expect(probabilities.probabilities.length).toEqual(4);

        // For disadvantage dice, the probability of getting a value n is:
        // P(n) = (2(n-1)+1)/n²
        // For d4, this gives us:
        // P(1) = 7/16
        // P(2) = 5/16
        // P(3) = 3/16
        // P(4) = 1/16
        expect(probabilities.probabilities[0]).toBeCloseTo(7/16, 5);
        expect(probabilities.probabilities[1]).toBeCloseTo(5/16, 5);
        expect(probabilities.probabilities[2]).toBeCloseTo(3/16, 5);
        expect(probabilities.probabilities[3]).toBeCloseTo(1/16, 5);

        expect(probabilities.total).toEqual(1);
    });

    it('should give a correct distribution for a d6', () => {
        const d6 = new DisadvantageDice(new Dice(6));
        const probabilities = d6.probabilities();

        expect(probabilities.minValue).toEqual(1);
        expect(probabilities.maxValue).toEqual(6);
        expect(probabilities.probabilities.length).toEqual(6);

        // For d6, the probabilities are:
        // P(1) = 11/36
        // P(2) = 9/36
        // P(3) = 7/36
        // P(4) = 5/36
        // P(5) = 3/36
        // P(6) = 1/36
        expect(probabilities.probabilities[0]).toBeCloseTo(11/36, 5);
        expect(probabilities.probabilities[1]).toBeCloseTo(9/36, 5);
        expect(probabilities.probabilities[2]).toBeCloseTo(7/36, 5);
        expect(probabilities.probabilities[3]).toBeCloseTo(5/36, 5);
        expect(probabilities.probabilities[4]).toBeCloseTo(3/36, 5);
        expect(probabilities.probabilities[5]).toBeCloseTo(1/36, 5);

        expect(probabilities.total).toEqual(1);
    });

    it('should give a correct distribution for a d20', () => {
        const d20 = new DisadvantageDice(new Dice(20));
        const probabilities = d20.probabilities();

        expect(probabilities.minValue).toEqual(1);
        expect(probabilities.maxValue).toEqual(20);
        expect(probabilities.probabilities.length).toEqual(20);

        // For d20, the probabilities follow the same pattern:
        // P(n) = (2(n-1)+1)/400
        // Let's verify a few key values:
        expect(probabilities.probabilities[0]).toBeCloseTo(39/400, 5);  // P(1)
        expect(probabilities.probabilities[9]).toBeCloseTo(21/400, 5); // P(10)
        expect(probabilities.probabilities[19]).toBeCloseTo(1/400, 5); // P(20)

        expect(probabilities.total).toEqual(1);
    });
}); 