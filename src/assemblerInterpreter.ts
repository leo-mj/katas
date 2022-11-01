import {
  Instruction,
  Dictionary,
  ReturnValue,
} from "./assemblerUtils/assemblerTypes";
import { executeAllLines } from "./assemblerUtils/executeLine";
import { parseProgram } from "./assemblerUtils/parseProgram";

export function assemblerInterpreter(program: string): ReturnValue {
  const programLines: Instruction[] = parseProgram(program);
  const dictionary: Dictionary = {};
  const returnValue: ReturnValue = executeAllLines(programLines, dictionary);
  return returnValue;
}
