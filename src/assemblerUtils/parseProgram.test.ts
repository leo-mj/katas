import { parseCommand, parseLine } from "./parseProgram";

test("parseLine returns the correct line", () => {
  expect(parseLine("mov  a, 5")).toStrictEqual({
    command: "mov",
    targetReg: "a",
    regOrVal: 5,
  });
  expect(parseLine("msg  '(5+1)/2 = ', a")).toStrictEqual({
    command: "msg",
    message: "'(5+1)/2 = ', a",
  });
  expect(parseLine("call  func2")).toStrictEqual({
    command: "call",
    labelName: "func2",
  });
});

test("parseCommand returns the correct line", () => {
  expect(parseCommand(["mov", " ", "a,", "5"])).toStrictEqual({
    command: "mov",
    targetReg: "a",
    regOrVal: 5,
  });
  expect(parseCommand(["msg", " ", "'(5+1)/2", "=", "',", "a"])).toStrictEqual({
    command: "msg",
    message: "'(5+1)/2 = ', a",
  });
  expect(parseCommand(["call", " ", "func2"])).toStrictEqual({
    command: "call",
    labelName: "func2",
  });
});
