import {
  nextBigger,
  nextBiggerOrInfinity,
  nextBiggerStartingWithFirstDigitOfN,
  smallestStartingWithCurrentDigit,
} from "./nextBiggerNumRecursive";

test("nextBigger returns the next largest number consisting of the digits of the input or -1", () => {
  expect(nextBigger(12)).toBe(21);
  expect(nextBigger(10)).toBe(-1);
  expect(nextBigger(2017)).toBe(2071);
});

test("nextBiggerOrInfinity the next largest number consisting of the digits of the input or Infinity", () => {
  expect(nextBiggerOrInfinity(12)).toBe(21);
  expect(nextBiggerOrInfinity(10)).toBe(Infinity);
  expect(nextBiggerOrInfinity(2017)).toBe(2071);
});

test("smallestStartingWithCurrentDigit returns the smallest number beginning with a given digit", () => {
  expect(smallestStartingWithCurrentDigit("1", "71")).toBe(117);
  expect(smallestStartingWithCurrentDigit("8", "11")).toBe(811);
  expect(smallestStartingWithCurrentDigit("8", "10")).toBe(801);
});

test(`nextBiggerStartingWithFirstDigitOfN returns the number consisting of remaining digits of n 
that is the next largest number after the current arrangement of the remaining digits of n or Infinity`, () => {
  expect(nextBiggerStartingWithFirstDigitOfN(3122, "3122")).toBe(3212);
  expect(nextBiggerStartingWithFirstDigitOfN(3012, "3012")).toBe(3021);
  expect(nextBiggerStartingWithFirstDigitOfN(3111, "3111")).toBe(Infinity);
});
