import {
  Dictionary,
  ExecutionContext,
  Instruction,
  ReturnValue,
} from "./assemblerUtils/assemblerTypes";
import {
  executeCall,
  executeRet,
} from "./executeLineUtils/executeCallAndReturn";
import {
  executeCmp,
  executeLabelJump,
} from "./executeLineUtils/executeLabelJump";
import { executeMsg } from "./executeLineUtils/executeMsg";
import { executeRegisterOperation } from "./executeLineUtils/executeRegisterOperation";

export function executeAllLines(
  programLines: Instruction[],
  dictionary: Dictionary,
): ReturnValue {
  const executionContext: ExecutionContext = {
    linePointer: 0,
    nextLine: 1,
    returnValue: -1,
    linesToReturnTo: [],
    dictionary,
  };

  while (programLines[executionContext.linePointer].command !== "end") {
    executeLine(executionContext, programLines);
    executionContext.linePointer = executionContext.nextLine;
    if (executionContext.linePointer >= programLines.length) {
      return -1;
    }
  }

  return executionContext.returnValue;
}

export function executeLine(
  executionContext: ExecutionContext,
  programLines: Instruction[],
): void {
  const { linePointer, dictionary } = executionContext;
  const currentLine: Instruction = programLines[linePointer];
  switch (currentLine.command) {
    case "comment":
    case "label":
      executionContext.nextLine = linePointer + 1;
      return;
    case "mov":
    case "inc":
    case "dec":
    case "add":
    case "sub":
    case "mul":
    case "div":
      executeRegisterOperation(currentLine, dictionary);
      executionContext.nextLine = linePointer + 1;
      break;
    case "cmp":
      executeCmp(currentLine, executionContext);
      executionContext.nextLine = linePointer + 1;
      break;
    case "jmp":
    case "jne":
    case "je":
    case "jge":
    case "jg":
    case "jle":
    case "jl":
      executeLabelJump(executionContext, currentLine, programLines);
      break;
    case "call":
      executeCall(executionContext, currentLine, programLines);
      break;
    case "ret":
      executeRet(executionContext);
      break;
    case "msg":
      executeMsg(executionContext, currentLine);
      executionContext.nextLine = linePointer + 1;
      break;
  }

  return;
}
