import { Dictionary, ExecutionContext, Instruction } from "./assemblerTypes";
import {
  executeCall,
  executeCmp,
  executeLabelJump,
  executeMsg,
  executeRegisterOperation,
  executeRet,
} from "./executeLine";

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

test("executeMsg sets returnValue to the correct message", () => {
  const testDictionary: Dictionary = { a: 3 };
  const executionContext: ExecutionContext = {
    linePointer: 0,
    nextLine: 1,
    returnValue: -1,
    linesToReturnTo: [],
    dictionary: testDictionary,
  };
  executeMsg(executionContext, {
    command: "msg",
    message: "'(5+1)/2 = ', a",
  });
  expect(executionContext).toStrictEqual({
    linePointer: 0,
    nextLine: 1,
    returnValue: "(5+1)/2 = 3",
    linesToReturnTo: [],
    dictionary: testDictionary,
  });
});

test("executeRet changes nextLine to the correct line", () => {
  const testDictionary: Dictionary = { a: 3 };
  const executionContext: ExecutionContext = {
    linePointer: 0,
    nextLine: 1,
    returnValue: -1,
    linesToReturnTo: [4],
    dictionary: testDictionary,
  };
  executeRet(executionContext);
  expect(executionContext).toStrictEqual({
    linePointer: 0,
    nextLine: 4,
    returnValue: -1,
    linesToReturnTo: [],
    dictionary: testDictionary,
  });
});

test("executeCall sets nextLine and linesToReturnTo to the correct values", () => {
  const programLines: Instruction[] = [
    { command: "call", labelName: "func" },
    { command: "label", labelName: "nextLine should not be 1" },
    { command: "label", labelName: "func" },
    { command: "label", labelName: "nextLine should be 3" },
  ];
  const testDictionary: Dictionary = { a: 3 };
  const executionContext: ExecutionContext = {
    linePointer: 0,
    nextLine: 1,
    returnValue: -1,
    linesToReturnTo: [],
    dictionary: testDictionary,
  };
  executeCall(
    executionContext,
    { command: "call", labelName: "func" },
    programLines,
  );
  expect(executionContext).toStrictEqual({
    linePointer: 0,
    nextLine: 3,
    returnValue: -1,
    linesToReturnTo: [1],
    dictionary: testDictionary,
  });
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
