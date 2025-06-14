import { MultipleDice } from "./MultipleDice";
import { Dice } from "./Dice";

describe('MultipleDice', () => {
    it('should roll in a range of sides', () => {
        const d = new MultipleDice(new Dice(6), 2);

        for (let i = 0; i < 100; i++) {
            const result = d.roll();
            expect(result).toBeGreaterThanOrEqual(2); // minimum for 2d6
            expect(result).toBeLessThanOrEqual(12);   // maximum for 2d6
        }
    });

    it('should convert to string version', () => {
        const d6 = new MultipleDice(new Dice(6), 3);
        expect(d6.toString()).toEqual("3d6");
    });

    it('should give a correct distribution for 2d4', () => {
        const d4 = new MultipleDice(new Dice(4), 2);
        const probabilities = d4.probabilities();

        expect(probabilities.minValue).toEqual(2);  // minimum for 2d4
        expect(probabilities.maxValue).toEqual(8);  // maximum for 2d4
        expect(probabilities.probabilities.length).toEqual(7); // 8-2+1 = 7 possible sums

        // For 2d4, the probabilities are:
        // P(2) = 1/16
        // P(3) = 2/16
        // P(4) = 3/16
        // P(5) = 4/16
        // P(6) = 3/16
        // P(7) = 2/16
        // P(8) = 1/16
        expect(probabilities.probabilities[0]).toBeCloseTo(1/16, 5);  // P(2)
        expect(probabilities.probabilities[1]).toBeCloseTo(2/16, 5);  // P(3)
        expect(probabilities.probabilities[2]).toBeCloseTo(3/16, 5);  // P(4)
        expect(probabilities.probabilities[3]).toBeCloseTo(4/16, 5);  // P(5)
        expect(probabilities.probabilities[4]).toBeCloseTo(3/16, 5);  // P(6)
        expect(probabilities.probabilities[5]).toBeCloseTo(2/16, 5);  // P(7)
        expect(probabilities.probabilities[6]).toBeCloseTo(1/16, 5);  // P(8)

        expect(probabilities.total).toEqual(1);
    });

    it('should give a correct distribution for 2d6', () => {
        const d6 = new MultipleDice(new Dice(6), 2);
        const probabilities = d6.probabilities();

        expect(probabilities.minValue).toEqual(2);  // minimum for 2d6
        expect(probabilities.maxValue).toEqual(12); // maximum for 2d6
        expect(probabilities.probabilities.length).toEqual(11); // 12-2+1 = 11 possible sums

        // For 2d6, the probabilities are:
        // P(2) = 1/36
        // P(3) = 2/36
        // P(4) = 3/36
        // P(5) = 4/36
        // P(6) = 5/36
        // P(7) = 6/36
        // P(8) = 5/36
        // P(9) = 4/36
        // P(10) = 3/36
        // P(11) = 2/36
        // P(12) = 1/36
        expect(probabilities.probabilities[0]).toBeCloseTo(1/36, 5);  // P(2)
        expect(probabilities.probabilities[1]).toBeCloseTo(2/36, 5);  // P(3)
        expect(probabilities.probabilities[2]).toBeCloseTo(3/36, 5);  // P(4)
        expect(probabilities.probabilities[3]).toBeCloseTo(4/36, 5);  // P(5)
        expect(probabilities.probabilities[4]).toBeCloseTo(5/36, 5);  // P(6)
        expect(probabilities.probabilities[5]).toBeCloseTo(6/36, 5);  // P(7)
        expect(probabilities.probabilities[6]).toBeCloseTo(5/36, 5);  // P(8)
        expect(probabilities.probabilities[7]).toBeCloseTo(4/36, 5);  // P(9)
        expect(probabilities.probabilities[8]).toBeCloseTo(3/36, 5);  // P(10)
        expect(probabilities.probabilities[9]).toBeCloseTo(2/36, 5);  // P(11)
        expect(probabilities.probabilities[10]).toBeCloseTo(1/36, 5); // P(12)

        expect(probabilities.total).toEqual(1);
    });

    it('should calculate correct probabilities for higher values', () => {
        const d6 = new MultipleDice(new Dice(6), 2);
        
        // P(sum > 7) = 1 - P(sum ≤ 7) = 1 - (1/36 + 2/36 + 3/36 + 4/36 + 5/36 + 6/36) = 15/36
        expect(d6.probabilityForHigher(7)).toBeCloseTo(15/36, 5);
        
        // P(sum > 11) = 1/36 (only 12 is higher)
        expect(d6.probabilityForHigher(11)).toBeCloseTo(1/36, 5);
        
        // P(sum > 12) = 0 (no values higher than 12)
        expect(d6.probabilityForHigher(12)).toBeCloseTo(0, 5);
    });

    it('should calculate correct probabilities for lower values', () => {
        const d6 = new MultipleDice(new Dice(6), 2);
        
        // P(sum < 7) = 1/36 + 2/36 + 3/36 + 4/36 + 5/36 = 15/36
        expect(d6.probabilityForLower(7)).toBeCloseTo(15/36, 5);
        
        // P(sum < 3) = 0 (no values lower than 2)
        expect(d6.probabilityForLower(3)).toBeCloseTo(1/36, 5);
        
        // P(sum < 13) = 1 (all values are lower than 13)
        expect(d6.probabilityForLower(13)).toBeCloseTo(1, 5);
    });

    it('should handle edge cases correctly', () => {
        const d6 = new MultipleDice(new Dice(6), 2);
        
        // Values below minimum
        expect(d6.probabilityFor(1)).toBeCloseTo(0, 5);
        expect(d6.probabilityForHigher(1)).toBeCloseTo(1, 5);
        expect(d6.probabilityForLower(1)).toBeCloseTo(0, 5);
        
        // Values above maximum
        expect(d6.probabilityFor(13)).toBeCloseTo(0, 5);
        expect(d6.probabilityForHigher(13)).toBeCloseTo(0, 5);
        expect(d6.probabilityForLower(13)).toBeCloseTo(1, 5);
    });
}); 