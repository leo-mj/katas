import {
  ExecutionContext,
  LabelJump,
  Instruction,
  Cmp,
  Integer,
} from "../assemblerUtils/assemblerTypes";
import { findLabelIndex } from "./findLabelIndex";

export function executeCmp(
  currentLine: Cmp,
  executionContext: ExecutionContext,
): void {
  const { regOrVal1, regOrVal2 } = currentLine;
  let [val1, val2]: (string | Integer)[] = [regOrVal1, regOrVal2];
  if (typeof val1 === "string") {
    val1 = executionContext.dictionary[val1];
  }
  if (typeof val2 === "string") {
    val2 = executionContext.dictionary[val2];
  }
  if (val1 === val2) {
    executionContext.returnValue = "equal";
    return;
  }
  if (val1 > val2) {
    executionContext.returnValue = "greater";
    return;
  }
  if (val1 < val2) {
    executionContext.returnValue = "less";
    return;
  }
  throw new Error(
    "Unknown registers or values: " + regOrVal1 + " and " + regOrVal2,
  );
}

export function executeLabelJump(
  executionContext: ExecutionContext,
  currentLine: LabelJump,
  programLines: Instruction[],
): void {
  const { command, labelName } = currentLine;
  const labelIndex: number = findLabelIndex(labelName, programLines);
  switch (command) {
    case "jmp":
      executionContext.nextLine = labelIndex + 1;
      return;
    case "jne":
      if (executionContext.returnValue !== "equal") {
        executionContext.nextLine = labelIndex + 1;
      } else {
        executionContext.nextLine++;
      }
      return;
    case "je":
      if (executionContext.returnValue === "equal") {
        executionContext.nextLine = labelIndex + 1;
      } else {
        executionContext.nextLine++;
      }
      return;
    case "jge":
      if (
        executionContext.returnValue === "equal" ||
        executionContext.returnValue === "greater"
      ) {
        executionContext.nextLine = labelIndex + 1;
      } else {
        executionContext.nextLine++;
      }
      return;
    case "jg":
      if (executionContext.returnValue === "greater") {
        executionContext.nextLine = labelIndex + 1;
      } else {
        executionContext.nextLine++;
      }
      return;
    case "jle":
      if (
        executionContext.returnValue === "equal" ||
        executionContext.returnValue === "less"
      ) {
        executionContext.nextLine = labelIndex + 1;
      } else {
        executionContext.nextLine++;
      }
      return;
    case "jl":
      if (executionContext.returnValue === "less") {
        executionContext.nextLine = labelIndex + 1;
      } else {
        executionContext.nextLine++;
      }
      return;
    default:
      throw new Error(`Unknown label: ${labelName}, or command: ${command}`);
  }
}
