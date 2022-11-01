import {
  RegisterCommand,
  RegisterOperation,
  Integer,
} from "../assemblerUtils/assemblerTypes";

export function parseRegisterOperation(
  command: RegisterCommand,
  argsRaw: string[],
): RegisterOperation {
  const args: string[] = argsRaw.filter((arg) => arg !== "" && arg !== " ");
  let targetReg: string = args[0];
  if (targetReg[targetReg.length - 1] === ",") {
    targetReg = targetReg.substring(0, targetReg.length - 1); // to get rid of the comma
  }
  let regOrVal: Integer | string = args[1];
  if (command === "inc") {
    regOrVal = 1;
  } else if (command === "dec") {
    regOrVal = -1;
  } else if (regOrVal.toUpperCase() === regOrVal.toLowerCase()) {
    regOrVal = parseInt(regOrVal);
  }
  return { command, targetReg, regOrVal };
}
