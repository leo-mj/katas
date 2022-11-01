import {
  Cmp,
  Integer,
  LabelJumpCommand,
  LabelJump,
  FunctionCallCommand,
  FunctionCall,
} from "../assemblerUtils/assemblerTypes";

export function parseCmp(argsRaw: string[]): Cmp {
  const args: string[] = argsRaw.filter((arg) => arg !== "" && arg !== " ");
  let regOrVal1: string | Integer = args[0].substring(0, args[0].length - 1); // to get rid of the comma
  if (regOrVal1.toUpperCase() === regOrVal1.toLowerCase()) {
    regOrVal1 = parseInt(regOrVal1);
  }
  let regOrVal2: string | Integer = args[1];
  if (regOrVal2.toUpperCase() === regOrVal2.toLowerCase()) {
    regOrVal2 = parseInt(regOrVal2);
  }

  return {
    command: "cmp",
    regOrVal1,
    regOrVal2,
  };
}

export function parseLabelJump(
  command: LabelJumpCommand,
  argsRaw: string[],
): LabelJump {
  const args: string[] = argsRaw.filter((arg) => arg !== "" && arg !== " ");
  const labelName: string = args[0];
  return { command, labelName };
}

export function parseFunctionCall(
  command: FunctionCallCommand,
  argsRaw: string[],
): FunctionCall {
  if (command === "end" || command === "ret") {
    return { command };
  }
  if (command === "call") {
    const args: string[] = argsRaw.filter((arg) => arg !== "" && arg !== " ");
    const labelName: string = args[0];
    return { command, labelName };
  }
  return { command, message: argsRaw.join(" ") };
}
