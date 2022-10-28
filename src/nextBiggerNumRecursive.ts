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
  const nextBiggerNumberOrNull: string | null = nextBiggerOrNull(n.toString());
  if (nextBiggerNumberOrNull && parseInt(nextBiggerNumberOrNull) > n) {
    return parseInt(nextBiggerNumberOrNull);
  }
  return -1;
}

export function nextBiggerOrNull(nDigits: string): string | null {
  const n = parseInt(nDigits);
  let nextBigger: string | null = null;

  if (nDigits.length === 1) {
    // base condition
    return nDigits;
  }

  for (let i = 0; i < nDigits.length; i++) {
    const currentDigit = nDigits[i];
    let nextBiggerGivenCurrentDigit: string = nDigits;
    const nWithoutCurrentDigit = nDigits.slice(0, i) + nDigits.slice(i + 1);

    if (parseInt(currentDigit) > parseInt(nDigits[0])) {
      nextBiggerGivenCurrentDigit = smallestStartingWithCurrentDigit(
        currentDigit,
        nWithoutCurrentDigit,
      );
    } else if (currentDigit === nDigits[0]) {
      nextBiggerGivenCurrentDigit =
        nextBiggerStartingWithFirstDigitOfN(nDigits);
    }

    if (
      parseInt(nextBiggerGivenCurrentDigit) > n &&
      (nextBigger === null ||
        parseInt(nextBiggerGivenCurrentDigit) < parseInt(nextBigger))
    ) {
      nextBigger = nextBiggerGivenCurrentDigit;
    }
  }
  return nextBigger;
}

export function smallestStartingWithCurrentDigit(
  currentDigit: string,
  nWithoutCurrentDigit: string,
): string {
  const smallestArrangementOfNRemainder = nWithoutCurrentDigit
    .split("")
    .sort()
    .join("");
  return currentDigit + smallestArrangementOfNRemainder;
}

export function nextBiggerStartingWithFirstDigitOfN(nDigits: string): string {
  const nRemainderStr = nDigits.slice(1);
  const nextBiggerRemaining: string | null = nextBiggerOrNull(nRemainderStr);
  if (nextBiggerRemaining === null) {
    return nDigits;
  }
  const nextBiggerStartingWithFirstDigit = nDigits[0] + nextBiggerRemaining;
  return nextBiggerStartingWithFirstDigit;
}
