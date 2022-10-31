import {
  Cmp,
  Dictionary,
  ExecutionReturns,
  Instruction,
  Integer,
  LabelJump,
  RegisterOperation,
  ReturnValue,
} from "./assemblerTypes";

export function executeAllLines(
  programLines: Instruction[],
  dictionary: Dictionary,
): string | -1 {
  let linePointer = 0;
  let previousValue: ReturnValue = -1;

  while (
    linePointer < programLines.length &&
    programLines[linePointer].command !== "end"
  ) {
    const { nextLine, returnValue } = executeLine(
      linePointer,
      programLines,
      dictionary,
      previousValue,
    );
    if (returnValue) {
      previousValue = returnValue;
    }
    linePointer = nextLine;
  }

  if (
    programLines[linePointer].command === "end" &&
    typeof previousValue === "string"
  ) {
    return previousValue;
  }

  return -1;
}

export function executeLine(
  linePointer: number,
  programLines: Instruction[],
  dictionary: Dictionary,
  previousValue: ReturnValue,
): ExecutionReturns {
  const currentLine: Instruction = programLines[linePointer];
  const defaultReturns: ExecutionReturns = {
    nextLine: linePointer + 1,
    returnValue: previousValue,
  };
  switch (currentLine.command) {
    case "comment":
    case "label":
      return defaultReturns;
    case "mov":
    case "inc":
    case "dec":
    case "add":
    case "sub":
    case "mul":
    case "div":
      executeRegisterOperation(currentLine, dictionary);
      return defaultReturns;
    case "cmp":
      const cmpValue: ReturnValue = executeCmp(currentLine, dictionary);
      return { nextLine: linePointer + 1, returnValue: cmpValue };
    case "jmp":
    case "jne":
    case "je":
    case "jge":
    case "jg":
    case "jle":
    case "jl":
      const labelJumpValue: ExecutionReturns = executeLabelJump(
        linePointer,
        currentLine,
        programLines,
        previousValue,
      );
      return labelJumpValue;
  }

  return defaultReturns;
}

export function executeLabelJump(
  linePointer: number,
  currentLine: LabelJump,
  programLines: Instruction[],
  previousValue: ReturnValue,
): ExecutionReturns {
  const { command, labelName } = currentLine;
  const defaultReturns: ExecutionReturns = {
    nextLine: linePointer + 1,
    returnValue: previousValue,
  };
  const labelIndex: number = findLabelIndex(labelName, programLines) + 1;
  switch (command) {
    case "jmp":
      return { nextLine: labelIndex, returnValue: previousValue };
    case "jne":
      if (previousValue !== "equal") {
        return { nextLine: labelIndex, returnValue: previousValue };
      }
      break;
    case "je":
      if (previousValue === "equal") {
        return { nextLine: labelIndex, returnValue: previousValue };
      }
      break;
    case "jge":
      if (previousValue === "equal" || previousValue === "greater") {
        return { nextLine: labelIndex, returnValue: previousValue };
      }
      break;
    case "jg":
      if (previousValue === "greater") {
        return { nextLine: labelIndex, returnValue: previousValue };
      }
      break;
    case "jle":
      if (previousValue === "equal" || previousValue === "less") {
        return { nextLine: labelIndex, returnValue: previousValue };
      }
      break;
    case "jl":
      if (previousValue === "less") {
        return { nextLine: labelIndex, returnValue: previousValue };
      }
      break;
    default:
      throw new Error(`Unknown label: ${labelName}, or command: ${command}`);
  }
  return defaultReturns;
}

export function findLabelIndex(
  labelName: string,
  programLines: Instruction[],
): number {
  for (let i = 0; i < programLines.length; i++) {
    const { command } = programLines[i];
    if (command === labelName) {
      return i;
    }
  }
  throw new Error("Unknown label: " + labelName);
}

export function executeCmp(
  currentLine: Cmp,
  dictionary: Dictionary,
): ReturnValue {
  const { regOrVal1, regOrVal2 } = currentLine;
  let [val1, val2]: (string | Integer)[] = [regOrVal1, regOrVal2];
  if (typeof val1 === "string") {
    val1 = dictionary[val1];
  }
  if (typeof val2 === "string") {
    val2 = dictionary[val2];
  }
  if (val1 === val2) {
    return "equal";
  }
  if (val1 > val2) {
    return "greater";
  }
  if (val1 < val2) {
    return "less";
  }
  throw new Error(
    "Unknown registers or values: " + regOrVal1 + " and " + regOrVal2,
  );
}

export function executeRegisterOperation(
  currentLine: RegisterOperation,
  dictionary: Dictionary,
): Dictionary {
  const { command, targetReg, regOrVal } = currentLine;
  switch (command) {
    case "mov":
      if (typeof regOrVal === "number") {
        dictionary[targetReg] = regOrVal;
      } else {
        dictionary[targetReg] = dictionary[regOrVal];
      }
      break;
    case "inc":
    case "dec":
    case "add":
      if (typeof regOrVal === "number") {
        dictionary[targetReg] += regOrVal;
      } else {
        dictionary[targetReg] += dictionary[regOrVal];
      }
      break;
    case "sub":
      if (typeof regOrVal === "number") {
        dictionary[targetReg] -= regOrVal;
      } else {
        dictionary[targetReg] -= dictionary[regOrVal];
      }
      break;
    case "mul":
      if (typeof regOrVal === "number") {
        dictionary[targetReg] *= regOrVal;
      } else {
        dictionary[targetReg] *= dictionary[regOrVal];
      }
      break;
    case "div":
      if (typeof regOrVal === "number") {
        dictionary[targetReg] /= regOrVal;
      } else {
        dictionary[targetReg] /= dictionary[regOrVal];
      }
      break;
    default:
      throw new Error(
        `Unknown targetRegister: ${targetReg}, or value: ${regOrVal}`,
      );
  }
  return dictionary;
}
