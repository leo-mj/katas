import { parseLine, parseProgram } from "./parseProgram";

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

  const program_power_two = `mov   a, 2            ; value1
mov   b, 2           ; value2
mov   c, a            ; temp1
mov   d, b            ; temp2
call  proc_func
call  print
end

proc_func:
    cmp   d, 1
    je    continue
    mul   c, a
    dec   d
    call  proc_func

continue:
    ret

print:
    msg a, '^', b, ' = ', c
    ret`;

  expect(parseProgram(program_power_two)).toStrictEqual([
    { command: "mov", targetReg: "a", regOrVal: 2 },
    { command: "mov", targetReg: "b", regOrVal: 2 },
    { command: "mov", targetReg: "c", regOrVal: "a" },
    { command: "mov", targetReg: "d", regOrVal: "b" },
    { command: "call", labelName: "proc_func" },
    { command: "call", labelName: "print" },
    { command: "end" },
    { command: "label", labelName: "proc_func" },
    { command: "cmp", regOrVal1: "d", regOrVal2: 1 },
    { command: "je", labelName: "continue" },
    { command: "mul", targetReg: "c", regOrVal: "a" },
    { command: "dec", targetReg: "d", regOrVal: -1 },
    { command: "call", labelName: "proc_func" },
    { command: "label", labelName: "continue" },
    { command: "ret" },
    { command: "label", labelName: "print" },
    { command: "msg", message: "a, '^', b, ' = ', c" },
    { command: "ret" },
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
