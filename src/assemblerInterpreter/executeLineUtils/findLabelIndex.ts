import { Instruction } from "../assemblerUtils/assemblerTypes";

export function findLabelIndex(
  labelName: string,
  programLines: Instruction[],
): number {
  for (let i = 0; i < programLines.length; i++) {
    const currentLine = programLines[i];
    if (
      currentLine.command === "label" &&
      currentLine.labelName === labelName
    ) {
      return i;
    }
  }
  throw new Error("Unknown label: " + labelName);
}
