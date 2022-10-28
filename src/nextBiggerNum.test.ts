import { nextBigger } from "./nextBiggerNum"

test.skip("nextBigger returns the next largest number consisting of the digits of the input", () => {
    expect(nextBigger(12)).toBe(21);
    expect(nextBigger(10)).toBe(-1);
})