import {
  Dictionary,
  ExecutionContext,
  Instruction,
} from "../assemblerUtils/assemblerTypes";
import { executeCmp, executeLabelJump } from "./executeLabelJump";

test("executeCmp sets returnValue to the correct comparison", () => {
  const testDictionary: Dictionary = {
    a: 4,
    b: 3,
  };
  const executionContext: ExecutionContext = {
    linePointer: 0,
    nextLine: 1,
    returnValue: -1,
    linesToReturnTo: [],
    dictionary: testDictionary,
  };
  executeCmp({ command: "cmp", regOrVal1: 1, regOrVal2: 3 }, executionContext);
  expect(executionContext.returnValue).toBe("less");
  executeCmp(
    { command: "cmp", regOrVal1: "b", regOrVal2: 3 },
    executionContext,
  );
  expect(executionContext.returnValue).toBe("equal");
  executeCmp(
    { command: "cmp", regOrVal1: "a", regOrVal2: "b" },
    executionContext,
  );
  expect(executionContext.returnValue).toBe("greater");
});

test("executeLabelJump sets nextLine to the correct value", () => {
  const programLines: Instruction[] = [
    { command: "label", labelName: "nextLine should not be 1" },
    { command: "label", labelName: "func" },
    { command: "label", labelName: "nextLine should be 3" },
  ];
  const testDictionary: Dictionary = { a: 3 };
  const executionContextJne: ExecutionContext = {
    linePointer: 0,
    nextLine: 1,
    returnValue: "less",
    linesToReturnTo: [],
    dictionary: testDictionary,
  };
  executeLabelJump(
    executionContextJne,
    { command: "jne", labelName: "func" },
    programLines,
  );
  expect(executionContextJne).toStrictEqual({
    linePointer: 0,
    nextLine: 2,
    returnValue: "less",
    linesToReturnTo: [],
    dictionary: testDictionary,
  });
  executeLabelJump(
    executionContextJne,
    { command: "je", labelName: "nextLine should not be 1" },
    programLines,
  );
  expect(executionContextJne).toStrictEqual({
    linePointer: 0,
    nextLine: 3,
    returnValue: "less",
    linesToReturnTo: [],
    dictionary: testDictionary,
  });
});
