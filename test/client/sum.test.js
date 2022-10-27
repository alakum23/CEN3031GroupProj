/**
 * You should import any frontend function you write and want to test and run all it's tests in 
 * similar *.test.js files created ONLY within this tests/frontend directory.
 */

import sum from "../../src/client/js/sum.js";

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
