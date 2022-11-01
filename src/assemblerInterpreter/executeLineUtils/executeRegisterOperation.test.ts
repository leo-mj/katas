import { Dictionary } from "../assemblerUtils/assemblerTypes";
import { executeRegisterOperation } from "./executeRegisterOperation";

test("executeRegisterOperation changes the dictionary correctly", () => {
  const testDictionary: Dictionary = {};
  executeRegisterOperation(
    { command: "mov", targetReg: "a", regOrVal: 5 },
    testDictionary,
  ),
    expect(testDictionary).toStrictEqual({ a: 5 });
  executeRegisterOperation(
    { command: "mov", targetReg: "b", regOrVal: 2 },
    testDictionary,
  );
  expect(testDictionary).toStrictEqual({ a: 5, b: 2 });

  executeRegisterOperation(
    { command: "add", targetReg: "b", regOrVal: 3 },
    testDictionary,
  );
  expect(testDictionary).toStrictEqual({ a: 5, b: 5 });
  executeRegisterOperation(
    { command: "div", targetReg: "b", regOrVal: "a" },
    testDictionary,
  );
  expect(testDictionary).toStrictEqual({ a: 5, b: 1 });
});
