import { Dice } from "./Dice";

describe('Dice', () => {
    it('should roll in a range of sides', () => {

        const d = new Dice(6);

        for (let i = 0; i < 100; i++) {
            const result = d.roll();
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(d.sides);
        }
    });
    it('should convert to string version', () => {

        const d6 = new Dice(6);

        expect(d6.toString()).toEqual("d6");
    });
    it('should give a correct distribution for a d4', () => {
        
        const d4 = new Dice(4);

        const probabilities = d4.probabilities();

        expect(probabilities.minValue).toEqual(1);
        expect(probabilities.maxValue).toEqual(4);
        expect(probabilities.probabilities.length).toEqual(4);

        probabilities.probabilities.forEach(value => expect(value).toEqual(.25));
    });
    it('should return correct possible values', () => {
        const d6 = new Dice(6);
        const possibleValues = d6.possibleValues();
        
        expect(possibleValues).toEqual([1, 2, 3, 4, 5, 6]);
        expect(possibleValues.length).toEqual(6);
    });
});