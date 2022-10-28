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
  const nextBiggerNumberOrN: number = nextBiggerOrInfinity(n);
  if (nextBiggerNumberOrN === n || nextBiggerNumberOrN === Infinity) {
    return -1;
  }
  return nextBiggerNumberOrN;
}

export function nextBiggerOrInfinity(n: number): number {
  let nextBigger = Infinity;
  const nDigits: string = n.toString();

  if (nDigits.length === 1) {
    // base condition
    return n;
  }

  for (let i = 0; i < nDigits.length; i++) {
    const currentDigit = nDigits[i];
    let nextBiggerGivenCurrentDigit: number = n;
    const nWithoutCurrentDigit = nDigits.slice(0, i) + nDigits.slice(i + 1);

    if (parseInt(currentDigit) > parseInt(nDigits[0])) {
      nextBiggerGivenCurrentDigit = smallestStartingWithCurrentDigit(
        currentDigit,
        nWithoutCurrentDigit,
      );
    } else if (currentDigit === nDigits[0]) {
      nextBiggerGivenCurrentDigit = nextBiggerStartingWithFirstDigitOfN(
        n,
        nDigits,
      );
    }

    if (
      nextBiggerGivenCurrentDigit > n &&
      nextBiggerGivenCurrentDigit < nextBigger
    ) {
      nextBigger = nextBiggerGivenCurrentDigit;
    }
  }
  return nextBigger;
}

export function smallestStartingWithCurrentDigit(
  currentDigit: string,
  nWithoutCurrentDigit: string,
): number {
  const smallestArrangementOfNRemainder = nWithoutCurrentDigit
    .split("")
    .sort()
    .join("");
  const nextBiggerGivenCurrentDigit = parseInt(
    currentDigit + smallestArrangementOfNRemainder,
  );
  return nextBiggerGivenCurrentDigit;
}

export function nextBiggerStartingWithFirstDigitOfN(
  n: number,
  nDigits: string,
): number {
  const nRemainderStr = nDigits.slice(1);
  const nRemainder = parseInt(nRemainderStr);
  const nextBiggerRemaining: number = nextBiggerOrInfinity(nRemainder);
  const nextBiggerStartingWithFirstDigit = n - nRemainder + nextBiggerRemaining;
  return nextBiggerStartingWithFirstDigit;
}
