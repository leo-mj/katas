import { parseCommand, parseLine, parseProgram } from "./parseProgram";

test("parseProgram returns the correct programLines", () => {
  const testInput1 = `; My first program
  mov  a, 5
  inc  a
  call function
  msg  '(5+1)/2 = ', a    ; output message
  end
  
  function:
      div  a, 2
      ret`;
  expect(parseProgram(testInput1)).toStrictEqual([
    { command: "mov", targetReg: "a", regOrVal: 5 },
    { command: "inc", targetReg: "a", regOrVal: 1 },
    { command: "call", labelName: "function" },
    { command: "msg", message: "'(5+1)/2 = ', a" },
    { command: "end" },
    { command: "label", labelName: "function" },
    { command: "div", targetReg: "a", regOrVal: 2 },
    { command: "ret" },
  ]);

  const program_fail = `call  func1
  call  print
  end
  
  func1:
      call  func2
      ret
  
  func2:
      ret
  
  print:
      msg 'This program should return -1'`;
  expect(parseProgram(program_fail)).toStrictEqual([
    { command: "call", labelName: "func1" },
    { command: "call", labelName: "print" },
    { command: "end" },
    { command: "label", labelName: "func1" },
    { command: "call", labelName: "func2" },
    { command: "ret" },
    { command: "label", labelName: "func2" },
    { command: "ret" },
    { command: "label", labelName: "print" },
    { command: "msg", message: "'This program should return -1'" },
  ]);
});

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
