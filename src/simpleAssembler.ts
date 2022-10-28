/*
This is a kata from CodeWars: https://www.codewars.com/kata/58e24788e24ddee28e000053/train/javascript

We want to create a simple interpreter of assembler which will support the following instructions:
mov x y - copies y (either a constant value or the content of a register) into register x
inc x - increases the content of the register x by one
dec x - decreases the content of the register x by one
jnz x y - jumps to an instruction y steps away (positive means forward, negative means backward, 
    y can be a register or a constant), but only if x (a constant or a register) is not zero

Example: simpleAssembler(['mov a 5','inc a','dec a','dec a','jnz a -1', 'inc a']) --> {'a': 1}
*/
/**
 * simpleAssembler
 * @param program: string[] - array of instructions in string format 
 * @returns - Dictionary object which holds values for each registerKey that gets initialised in the program 
 */
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

interface Dictionary {
    [letter: string]: number,
}
  
interface Instruction {
command: string,
registerKey: string,
value: string,
}