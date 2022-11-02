import { assemblerInterpreter } from "./assemblerInterpreter";

test("assemblerInterpreter returns the correct registers", () => {
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

  const nestedCall = ` 
  call  func1
  call  print
  end

  func1:
      call  func2
      ret

  func2:
      ret

  print:
      msg 'This program should return this message'
      ret
`;
  expect(assemblerInterpreter(nestedCall)).toBe(
    "This program should return this message",
  );

  const program_power_part = `mov   a, 2            ; value1
mov   b, 1           ; value2
mov   c, a            ; temp1
mov   d, b            ; temp2
call  print
end

continue:
    ret

print:
    msg a, '^', b, ' = ', c
    ret`;

  expect(assemblerInterpreter(program_power_part)).toBe("2^1 = 2");

  const program_power_returning = `mov   a, 2            ; value1
mov   b, 2           ; value2
mov   c, a            ; temp1
mov   d, b            ; temp2
call  proc_func
end

proc_func:
    cmp   d, 1
    je    continue
    mul   c, a
    dec   d
    jmp  proc_func

continue:
    msg a, '^', b, ' = ', c
    ret
`;

  expect(assemblerInterpreter(program_power_returning)).toBe("2^2 = 4");

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

  expect(assemblerInterpreter(program_power_two)).toBe("2^2 = 4");

  /*const program_power = `mov   a, 2            ; value1
mov   b, 10           ; value2
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

expect(assemblerInterpreter(program_power)).toBe('2^10 = 1024');*/
});
