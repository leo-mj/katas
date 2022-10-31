import { assemblerInterpreter } from "./assemblerInterpreter";

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
