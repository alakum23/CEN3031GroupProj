/**
 * You should import any backend function you write and want to test and run all it's tests in 
 * similar *.test.js files created ONLY within this tests/backend directory.
 */

import mult from "../../src/server/multiply";

test('adds 3 + 2 to equal 5', () => {
    expect(3 + 2).toBe(5);
});

test('mult(3, 2) equals 6', () =>  {
    expect(mult(3, 2)).toBe(9);
});
