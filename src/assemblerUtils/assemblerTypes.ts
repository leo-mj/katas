export type Integer = number;
export type RegisterKey = string;
export interface Dictionary {
  [key: RegisterKey]: Integer;
}

export type Instruction =
  | RegisterOperation
  | { command: "label"; labelName: string }
  | Cmp
  | LabelJump
  | FunctionCall
  | { command: "comment" };

export type RegisterCommand =
  | "mov"
  | "add"
  | "sub"
  | "mul"
  | "div"
  | "inc"
  | "dec";
export type RegisterOperation = {
  command: RegisterCommand;
  targetReg: RegisterKey;
  regOrVal: Integer | RegisterKey;
};

export interface Cmp {
  command: "cmp";
  regOrVal1: string | Integer;
  regOrVal2: string | Integer;
}

export type LabelJumpCommand =
  | "jmp"
  | "jne"
  | "je"
  | "jge"
  | "jg"
  | "jle"
  | "jl";
export interface LabelJump {
  command: LabelJumpCommand;
  labelName: string;
}

export type FunctionCallCommand = "call" | "ret" | "msg" | "end";
export type FunctionCall =
  | { command: "ret" | "end" }
  | { command: "call"; labelName: string }
  | { command: "msg"; message: string };

export type ReturnValue = number | string;
export interface ExecutionContext {
  linePointer: number;
  nextLine: number;
  returnValue: ReturnValue;
  linesToReturnTo: number[];
  dictionary: Dictionary;
}
