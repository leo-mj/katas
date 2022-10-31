export type Integer = number;
export type RegisterKey = string;
export interface Dictionary {
  [key: RegisterKey]: Integer;
}

export type Instruction =
  | RegisterOperation
  | { command: "label"; labelName: string }
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

export type LabelJumpCommand =
  | "jmp"
  | "jne"
  | "je"
  | "jge"
  | "jg"
  | "jle"
  | "jl";
export type LabelJump =
  | { command: LabelJumpCommand; labelName: string }
  | {
      command: "cmp";
      regOrVal1: Integer | RegisterKey;
      regOrVal2: Integer | RegisterKey;
    };

export type FunctionCallCommand = "call" | "ret" | "msg" | "end";
export type FunctionCall =
  | { command: "ret" | "end" }
  | { command: "call"; labelName: string }
  | { command: "msg"; message: string };

export type returnValue = -1 | string;
export interface ExecutionReturns {
  nextLine: number;
  returnValue: string | -1;
}
