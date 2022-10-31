import {
  Dictionary,
  ExecutionReturns,
  Instruction,
  RegisterOperation,
} from "./assemblerTypes";

export function executeLine(
  linePointer: number,
  programLines: Instruction[],
  dictionary: Dictionary,
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
  }

  return defaultReturns;
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
