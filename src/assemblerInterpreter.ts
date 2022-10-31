import { Instruction, Dictionary } from "./assemblerUtils/assemblerTypes";
import { executeLine } from "./assemblerUtils/executeLine";
import { parseProgram } from "./assemblerUtils/parseProgram";

export function assemblerInterpreter(program: string): string | -1 {
  const programLines: Instruction[] = parseProgram(program);
  const dictionary: Dictionary = {};
  let linePointer = 0;
  let previousValue = null;
  let result: string | -1 = -1;

  while (linePointer < programLines.length) {
    if (programLines[linePointer].command === "end") {
      return result;
    }
    const { nextLine, returnValue } = executeLine(
      linePointer,
      programLines,
      dictionary,
    );
    if (returnValue) {
      result = returnValue;
    }
    linePointer = nextLine;
  }

  return result;
}
