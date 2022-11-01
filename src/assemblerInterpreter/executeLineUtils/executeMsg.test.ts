import { Dictionary, ExecutionContext } from "../assemblerUtils/assemblerTypes";
import { executeMsg } from "./executeMsg";

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
