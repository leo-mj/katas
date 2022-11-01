import {
  Instruction,
  RegisterOperation,
  Cmp,
  LabelJump,
  FunctionCall,
} from "../assemblerUtils/assemblerTypes";
import { parseCmp, parseLabelJump, parseFunctionCall } from "./parseLabelJump";
import { parseRegisterOperation } from "./parseRegisterOperation";

export function parseCommand(splitLine: string[]): Instruction {
  const command: string = splitLine[0];
  if (command.includes(":")) {
    const labelName: string = command.split(":")[0];
    return { command: "label", labelName };
  }
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
