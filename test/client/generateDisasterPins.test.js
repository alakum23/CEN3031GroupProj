// Import Statements
import { generateDisasterPins } from "../../src/client/js/generateDisasterPins.js";

// Test function here
describe('generateDisasterPins() Function', () =>  {

    it('Should return nothing when improper arguments are supplied', async () =>  {
        const result1 = await generateDisasterPins();
        expect(result1).toEqual([]);
        expect(result1.length).toEqual(0);

        const result2 = await generateDisasterPins(5);
        expect(result2).toEqual([]);
        expect(result2.length).toEqual(0);

        const result3 = await generateDisasterPins({});
        expect(result3).toEqual([]);
        expect(result3.length).toEqual(0);
    });

    it('Should return an empty array if no data is passed.', async () => {
        const result = await generateDisasterPins([]);
        expect(result).toEqual([]);
        expect(result.length).toEqual(0);
    });
});
