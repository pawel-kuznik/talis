import { Dice } from "./Dice";
import { RollSuite } from "./RollSuite";

describe("RollSuite", () => {

    it('should give results for a D6', () => {

        const dice = new Dice(6);
        const suite = new RollSuite(dice);

        const result = suite.run();

        expect(result.rolls).toContain(1);
        expect(result.rolls).toContain(2);
        expect(result.rolls).toContain(3);
        expect(result.rolls).toContain(4);
        expect(result.rolls).toContain(5);
        expect(result.rolls).toContain(6);
    });
});