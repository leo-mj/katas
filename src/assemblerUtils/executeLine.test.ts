import { Dictionary } from "./assemblerTypes";
import { executeRegisterOperation } from "./executeLine";

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
