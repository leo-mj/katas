interface Dictionary {
    [letter: string]: number,
  }
  
interface Instruction {
command: string,
registerKey: string,
value: string,
}

export function simpleAssembler(program: string[]): Dictionary {
    const registers: Dictionary = {};
    return registers;
}