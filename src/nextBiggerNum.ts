/*
https://www.codewars.com/kata/55983863da40caa2c900004e/train/javascript
Create a function that takes a positive integer and returns the next bigger number that can be formed by rearranging its digits. 
For example:
12 ==> 21
513 ==> 531
2017 ==> 2071
If the digits can't be rearranged to form a bigger number, return -1
 */

export function nextBigger(n: number): number {
  const nextBiggerNumberOrN: number = nextBiggerOrN(n);

  if (nextBiggerNumberOrN === n || nextBiggerNumberOrN === Infinity) {
    return -1;
  }

  return nextBiggerNumberOrN;
}

export function nextBiggerOrN(n: number): number {
  let nextBigger = Infinity;
  const nDigits: string[] = toStringArr(n);

  if (nDigits.length === 1) {
    // base condition
    return n;
  }

  for (let i = 0; i < nDigits.length; i++) {
    const startingDigit = nDigits[i];
    let nextBiggerGivenStarting: number = n;
    const remainingDigits = nDigits.slice(0, i).concat(nDigits.slice(i + 1));

    if (parseInt(startingDigit) > parseInt(nDigits[0])) {
      const smallestRemainingArrangement = remainingDigits.sort();
      nextBiggerGivenStarting = toNum(
        [startingDigit].concat(smallestRemainingArrangement),
      );
    } else if (startingDigit === nDigits[0]) {
      const remainingDigitsOfNAsNum = toNum(nDigits.slice(1));
      const nextBiggerRemaining: number = nextBiggerOrN(
        remainingDigitsOfNAsNum,
      );
      nextBiggerGivenStarting =
        n - remainingDigitsOfNAsNum + nextBiggerRemaining;
    }
    if (nextBiggerGivenStarting > n && nextBiggerGivenStarting < nextBigger) {
      nextBigger = nextBiggerGivenStarting;
    }
  }
  return nextBigger;
}

function toStringArr(n: number): string[] {
  return n.toString().split("");
}

function toNum(digits: string[]): number {
  return parseInt(digits.join(""));
}
