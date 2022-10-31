import {
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
): ReturnValue {
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

  if (programLines[linePointer].command === "end") {
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
    returnValue: -1,
  };
  switch (currentLine.command) {
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
      const returnValue: ReturnValue = executeCmp(currentLine, dictionary);
      return { nextLine: linePointer + 1, returnValue };
    case "jmp":
    case "jne":
    case "je":
    case "jge":
    case "jg":
    case "jle":
    case "jl":
      executeLabelJump(currentLine, dictionary);
  }

  return defaultReturns;
}

export function executeCmp(
  currentLine: {
    command: "cmp";
    regOrVal1: string | Integer;
    regOrVal2: string | Integer;
  },
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
