import { Instruction, Dictionary } from "./assemblerUtils/assemblerTypes";
import { executeAllLines } from "./assemblerUtils/executeLine";
import { parseProgram } from "./assemblerUtils/parseProgram";

export function assemblerInterpreter(program: string): string | -1 {
  const programLines: Instruction[] = parseProgram(program);
  const dictionary: Dictionary = {};
  const returnValue: string | -1 = executeAllLines(programLines, dictionary);
  return returnValue;
}
