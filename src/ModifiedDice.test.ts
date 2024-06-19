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
    it('should give a correct distribution for a d4', () => {
        
        const d4 = new ModifiedDice(8, 2);

        const probabilities = d4.probabilities();

        expect(probabilities.minValue).toEqual(3);
        expect(probabilities.maxValue).toEqual(10);
        expect(probabilities.probabilities.length).toEqual(8);

        probabilities.probabilities.forEach(value => expect(value).toEqual(.125));
    });
});