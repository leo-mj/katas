import {
  ExecutionContext,
  FunctionCall,
  Instruction,
} from "../assemblerUtils/assemblerTypes";
import { findLabelIndex } from "./findLabelIndex";

export function executeRet(executionContext: ExecutionContext): void {
  if (executionContext.linesToReturnTo.length < 1) {
    throw new Error("No line to return to");
  }
  executionContext.nextLine =
    executionContext.linesToReturnTo[
      executionContext.linesToReturnTo.length - 1
    ];
  executionContext.linesToReturnTo.pop();
  return;
}

export function executeCall(
  executionContext: ExecutionContext,
  currentLine: FunctionCall,
  programLines: Instruction[],
): void {
  if (currentLine.command === "call") {
    const { labelName } = currentLine;
    executionContext.nextLine = findLabelIndex(labelName, programLines) + 1;
    executionContext.linesToReturnTo.push(executionContext.linePointer + 1);
    return;
  } else {
    throw new Error("No label after call command");
  }
}
