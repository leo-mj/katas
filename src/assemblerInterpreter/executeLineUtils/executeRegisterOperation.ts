import {
  RegisterOperation,
  Dictionary,
} from "../assemblerUtils/assemblerTypes";

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
      const divisor: number =
        typeof regOrVal === "number" ? regOrVal : dictionary[regOrVal];
      dictionary[targetReg] = Math.floor(dictionary[targetReg] / divisor);
      break;
    default:
      throw new Error(
        `Unknown targetRegister: ${targetReg}, or value: ${regOrVal}`,
      );
  }
  return dictionary;
}
