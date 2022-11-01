import {
  Cmp,
  Dictionary,
  ExecutionContext,
  FunctionCall,
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
  const executionContext: ExecutionContext = {
    linePointer: 0,
    nextLine: 1,
    returnValue: -1,
    linesToReturnTo: [],
    dictionary,
  };
  const { linePointer, nextLine, returnValue } = executionContext;

  while (
    linePointer < programLines.length &&
    programLines[linePointer].command !== "end"
  ) {
    executeLine(executionContext, programLines);
    executionContext.linePointer = nextLine;
  }

  if (
    programLines[linePointer].command === "end" &&
    typeof returnValue === "string"
  ) {
    return returnValue;
  }

  return -1;
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

export function executeMsg(
  executionContext: ExecutionContext,
  currentLine: FunctionCall,
): void {
  if (currentLine.command !== "msg") {
    throw new Error("Unknown command: " + currentLine.command);
  }
  const { message } = currentLine;
  const splitMessage: string[] = message.split(", ");
  const translatedMessage: string = translateMessage(splitMessage, executionContext.dictionary);
  executionContext.returnValue = translatedMessage;
  return;
}

export function translateMessage(
  splitMessage: string[],
  dictionary: Dictionary,
): string {
  const translatedSplitMessage: string[] = splitMessage.map((part) => {
    if (part[0] === "'" && part[part.length - 1] === "'") {
      return part.substring(1, part.length - 1);
    }
    if (dictionary[part]) {
      return dictionary[part].toString();
    }
    throw new Error(part + " is not in dictionary: " + dictionary);
  });

  const translatedMessage: string = translatedSplitMessage.join("");
  return translatedMessage;
}

export function executeRet(executionContext: ExecutionContext): void {
  let {linesToReturnTo, nextLine} = executionContext;
  if (executionContext.linesToReturnTo.length < 1) {
    throw new Error("No line to return to");
  }
  executionContext.nextLine = executionContext.linesToReturnTo[executionContext.linesToReturnTo.length - 1];
  executionContext.linesToReturnTo.pop();
  return;
}

export function executeCall(
 executionContext: ExecutionContext,
  currentLine: FunctionCall,
  programLines: Instruction[],
): void {
  const { command } = currentLine;
  if (command !== "call") {
    throw new Error("No label after call command");
  }
  const { labelName } = currentLine;
  executionContext.nextLine = findLabelIndex(labelName, programLines) + 1;
  executionContext.linesToReturnTo.push(executionContext.linePointer + 1);
  return;
}

export function executeLabelJump(
  { nextLine, returnValue, linesToReturnTo }: ExecutionContext,
  currentLine: LabelJump,
  programLines: Instruction[],
): void {
  const { command, labelName } = currentLine;
  const labelIndex: number = findLabelIndex(labelName, programLines);
  switch (command) {
    case "jmp":
      nextLine = labelIndex + 1;
      return;
    case "jne":
      if (returnValue !== "equal") {
        nextLine = labelIndex + 1;
        return;
      }
      break;
    case "je":
      if (returnValue === "equal") {
        nextLine = labelIndex + 1;
        return;
      }
    case "jge":
      if (returnValue === "equal" || returnValue === "greater") {
        nextLine = labelIndex + 1;
        return;
      }
    case "jg":
      if (returnValue === "greater") {
        nextLine = labelIndex + 1;
        return;
      }
    case "jle":
      if (returnValue === "equal" || returnValue === "less") {
        nextLine = labelIndex + 1;
        return;
      }
    case "jl":
      if (returnValue === "less") {
        nextLine = labelIndex + 1;
        return;
      }
    default:
      throw new Error(`Unknown label: ${labelName}, or command: ${command}`);
  }
  return;
}

export function findLabelIndex(
  labelName: string,
  programLines: Instruction[],
): number {
  for (let i = 0; i < programLines.length; i++) {
    const currentLine = programLines[i];
    if (currentLine.command === "label" && currentLine.labelName === labelName) {
      return i;
    }
  }
  throw new Error("Unknown label: " + labelName);
}

export function executeCmp(
  currentLine: Cmp,
  { returnValue, dictionary }: ExecutionContext,
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
    returnValue = "equal";
    return returnValue;
  }
  if (val1 > val2) {
    returnValue = "greater";
    return returnValue;
  }
  if (val1 < val2) {
    returnValue = "less";
    return returnValue;
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
