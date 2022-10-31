import { Instruction, Dictionary } from "./assemblerUtils/assemblerTypes";
import { parseProgram } from "./assemblerUtils/parseProgram";

export function assemblerInterpreter(program: string): string | -1 {
  const programLines: Instruction[] = parseProgram(program);
  const registers: Dictionary = {};
  let linePointer = 0;

  // for (const line of programLines) {
  //     const {nextLine, returnValue} = executeLine(line, linePointer, programLines);
  linePointer++;
  // }

  return -1;
}

