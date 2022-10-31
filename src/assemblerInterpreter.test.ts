import {
  assemblerInterpreter,
  parseCommand,
  parseLine,
} from "./assemblerInterpreter";

test.skip("assemblerInterpreter returns the correct registers", () => {
  const testInput1 = `; My first program
mov  a, 5
inc  a
call function
msg  '(5+1)/2 = ', a    ; output message
end

function:
    div  a, 2
    ret`;
  expect(assemblerInterpreter(testInput1)).toBe("(5+1)/2 = 3");

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

  expect(assemblerInterpreter(program_fail)).toBe(-1);
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
