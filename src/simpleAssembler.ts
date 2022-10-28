interface Dictionary {
    [letter: string]: number,
  }
  
interface Instruction {
command: string,
registerKey: string,
value: string,
}

export function simpleAssembler(program: string[]): Dictionary {
    const instructions: Instruction[] = program.map(interpretStep);
    const registers: Dictionary = {};
    return registers;
}

export function interpretStep(step: string): Instruction {
    const command: string = step.substring(0, 3);
    const registerKey: string = step[4];
    let value: string = step.substring(6);
    if (command === "inc") {
      value = '1';
    } else if (command === "dec") {
      value = '-1';
    }
    return { command: command, registerKey: registerKey, value: value };
  }