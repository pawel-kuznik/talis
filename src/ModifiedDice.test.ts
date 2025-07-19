import { ModifiedDice } from "./ModifiedDice";

describe('ModifiedDice', () => {

    it('should roll in a range of sides', () => {

        const d = new ModifiedDice(6, 4);

        for (let i = 0; i < 100; i++) {
            const result = d.roll();
            expect(result).toBeGreaterThanOrEqual(1+4);
            expect(result).toBeLessThanOrEqual(d.sides+4);
        }
    });
    it('should convert to string version', () => {

        const d6 = new ModifiedDice(6, 5);

        expect(d6.toString()).toEqual("d6+5");
    });
    it('should give a correct distribution for a d6+2', () => {
        const d6plus2 = new ModifiedDice(6, 2);
        const probabilities = d6plus2.probabilities();

        expect(probabilities.minValue).toEqual(3); // 1+2
        expect(probabilities.maxValue).toEqual(8); // 6+2
        expect(probabilities.probabilities.length).toEqual(6); // 8-3+1 = 6

        // Each probability should be 1/6 since we're just shifting the distribution
        probabilities.probabilities.forEach(prob => {
            expect(prob).toBeCloseTo(1/6, 5);
        });

        expect(probabilities.total).toEqual(1);
    });

    it('should calculate correct probabilities for specific values', () => {
        const d6plus2 = new ModifiedDice(6, 2);
        
        // P(3) = P(original dice = 1) = 1/6
        expect(d6plus2.probabilityFor(3)).toBeCloseTo(1/6, 5);
        // P(8) = P(original dice = 6) = 1/6
        expect(d6plus2.probabilityFor(8)).toBeCloseTo(1/6, 5);
        // P(2) = 0 (impossible value)
        expect(d6plus2.probabilityFor(2)).toBeCloseTo(0, 5);
        // P(9) = 0 (impossible value)
        expect(d6plus2.probabilityFor(9)).toBeCloseTo(0, 5);
    });

    it('should calculate correct probabilities for higher values', () => {
        const d6plus2 = new ModifiedDice(6, 2);
        
        // P(value > 5) = P(original > 3) = 3/6 = 0.5
        expect(d6plus2.probabilityForHigher(5)).toBeCloseTo(3/6, 5);
        // P(value > 8) = 0 (no values higher than 8)
        expect(d6plus2.probabilityForHigher(8)).toBeCloseTo(0, 5);
    });

    it('should calculate correct probabilities for lower values', () => {
        const d6plus2 = new ModifiedDice(6, 2);
        
        // P(value < 5) = P(original < 3) = 2/6 = 1/3
        expect(d6plus2.probabilityForLower(5)).toBeCloseTo(2/6, 5);
        // P(value < 3) = 0 (no values lower than 3)
        expect(d6plus2.probabilityForLower(3)).toBeCloseTo(0, 5);
    });

    it('should return correct possible values', () => {
        const d6plus2 = new ModifiedDice(6, 2);
        const possibleValues = d6plus2.possibleValues();
        
        expect(possibleValues).toEqual([3, 4, 5, 6, 7, 8]);
        expect(possibleValues.length).toEqual(6);
    });

    it('should handle negative modifiers correctly', () => {
        const d6minus1 = new ModifiedDice(6, -1);
        const possibleValues = d6minus1.possibleValues();
        
        expect(possibleValues).toEqual([0, 1, 2, 3, 4, 5]);
        expect(possibleValues.length).toEqual(6);

        // Each probability should still be 1/6
        expect(d6minus1.probabilityFor(0)).toBeCloseTo(1/6, 5); // original 1
        expect(d6minus1.probabilityFor(5)).toBeCloseTo(1/6, 5); // original 6
    });
});