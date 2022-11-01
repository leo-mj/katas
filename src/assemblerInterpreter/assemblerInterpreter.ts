import {
  Instruction,
  Dictionary,
  ReturnValue,
} from "./assemblerUtils/assemblerTypes";
import { executeAllLines } from "./executeLine";
import { parseProgram } from "./parseProgram";

export function assemblerInterpreter(program: string): ReturnValue {
  const programLines: Instruction[] = parseProgram(program);
  const dictionary: Dictionary = {};
  const returnValue: ReturnValue = executeAllLines(programLines, dictionary);
  return returnValue;
}
