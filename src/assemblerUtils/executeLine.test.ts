import { Dictionary, ExecutionContext } from "./assemblerTypes";
import { executeCmp, executeRegisterOperation } from "./executeLine";

test("executeRegisterOperation returns the correct dictionary", () => {
  const testDictionary: Dictionary = {};
  expect(
    executeRegisterOperation(
      { command: "mov", targetReg: "a", regOrVal: 5 },
      testDictionary,
    ),
  ).toStrictEqual({ a: 5 });
  expect(
    executeRegisterOperation(
      { command: "mov", targetReg: "b", regOrVal: 2 },
      testDictionary,
    ),
  ).toStrictEqual({ a: 5, b: 2 });
  expect(
    executeRegisterOperation(
      { command: "add", targetReg: "b", regOrVal: 3 },
      testDictionary,
    ),
  ).toStrictEqual({ a: 5, b: 5 });
  expect(
    executeRegisterOperation(
      { command: "div", targetReg: "b", regOrVal: "a" },
      testDictionary,
    ),
  ).toStrictEqual({ a: 5, b: 1 });
});

test("executeCmp returns the correct comparison", () => {
  const testDictionary: Dictionary = {
    a: 4,
    b: 3,
  };
  const executionContext: ExecutionContext = {
    linePointer: 0,
    nextLine: 1,
    returnValue: -1,
    linesToReturnTo: [],
    dictionary: testDictionary
  }
  expect(
    executeCmp({ command: "cmp", regOrVal1: 1, regOrVal2: 3 }, executionContext),
  ).toBe("less");
  expect(
    executeCmp(
      { command: "cmp", regOrVal1: "b", regOrVal2: 3 },
      executionContext,
    ),
  ).toBe("equal");
  expect(
    executeCmp(
      { command: "cmp", regOrVal1: "a", regOrVal2: "b" },
      executionContext,
    ),
  ).toBe("greater");
});
