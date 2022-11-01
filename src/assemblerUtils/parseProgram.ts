import {
  Instruction,
  RegisterOperation,
  LabelJump,
  FunctionCall,
  RegisterCommand,
  RegisterKey,
  Integer,
  LabelJumpCommand,
  FunctionCallCommand,
  Cmp,
} from "./assemblerTypes";

export function parseProgram(program: string): Instruction[] {
  const rawLines: string[] = program.split("\n");
  const linesAsInstructions: Instruction[] = [];
  for (const line of rawLines) {
    const instruction: Instruction | undefined = parseLine(line);
    if (instruction !== undefined) {
      linesAsInstructions.push(instruction);
    }
  }
  return linesAsInstructions;
}

export function parseLine(lineStr: string): Instruction | undefined {
  const lineStrWithoutComments: string = lineStr.split(";")[0];
  if (lineStrWithoutComments === "") {
    return undefined;
  }
  const trimmedLine: string = lineStrWithoutComments.trim();
  if (trimmedLine === "") {
    return undefined;
  }
  if (trimmedLine.includes(":")) {
    const labelName: string = trimmedLine.split(":")[0];
    return { command: "label", labelName };
  }
  const splitLine: string[] = trimmedLine.split(" ");
  const commandWithArgs: Instruction = parseCommand(splitLine);
  return commandWithArgs;
}

export function parseCommand(splitLine: string[]): Instruction {
  const command: string = splitLine[0];
  let args: string[] = splitLine.slice(1);
  if (args[0] === "" || args[0] === " ") {
    args = args.slice(1);
  }
  switch (command) {
    case "mov":
    case "inc":
    case "dec":
    case "add":
    case "sub":
    case "mul":
    case "div":
      const registerOperation: RegisterOperation = parseRegisterOperation(
        command,
        args,
      );
      return registerOperation;
    case "cmp":
      const cmp: Cmp = parseCmp(args);
      return cmp;
    case "jmp":
    case "jne":
    case "je":
    case "jge":
    case "jg":
    case "jle":
    case "jl":
      const labelJump: LabelJump = parseLabelJump(command, args);
      return labelJump;
    case "call":
    case "ret":
    case "msg":
    case "end":
      const functionCall: FunctionCall = parseFunctionCall(command, args);
      return functionCall;
    default:
      throw new Error("Unknown command when parsing instruction: " + command);
  }
}

function parseRegisterOperation(
  command: RegisterCommand,
  args: string[],
): RegisterOperation {
  let targetReg: RegisterKey = args[0];
  if (targetReg[targetReg.length - 1] === ",") {
    targetReg = targetReg.substring(0, targetReg.length - 1); // to get rid of the comma
  }
  let regOrVal: Integer | RegisterKey = args[1];
  if (command === "inc") {
    regOrVal = 1;
  } else if (command === "dec") {
    regOrVal = -1;
  } else if (regOrVal.toUpperCase() === regOrVal.toLowerCase()) {
    regOrVal = parseInt(regOrVal);
  }
  return { command, targetReg, regOrVal };
}

function parseCmp(args: string[]): Cmp {
  const [regOrVal1, regOrVal2]: string[] = args;
  return {
    command: "cmp",
    regOrVal1: regOrVal1.substring(0, regOrVal1.length - 1),
    regOrVal2,
  };
}

function parseLabelJump(command: LabelJumpCommand, args: string[]): LabelJump {
  const labelName: string = args[0];
  return { command, labelName };
}

function parseFunctionCall(
  command: FunctionCallCommand,
  args: string[],
): FunctionCall {
  if (command === "end" || command === "ret") {
    return { command };
  }
  if (command === "call") {
    const labelName: string = args[0];
    return { command, labelName };
  }
  return { command, message: args.join(" ") };
}
