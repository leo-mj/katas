import {
  Dictionary,
  ExecutionContext,
  Instruction,
} from "../assemblerUtils/assemblerTypes";
import { executeRet, executeCall } from "./executeCallAndReturn";

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
