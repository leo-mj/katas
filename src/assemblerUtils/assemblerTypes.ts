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

export type ComplexRegisterCommand = "mov" | "add" | "sub" | "mul" | "div";
export type RegisterOperation =
  | {
      command: ComplexRegisterCommand;
      targetReg: RegisterKey;
      regOrVal: Integer | RegisterKey;
    }
  | { command: "inc" | "dec"; targetReg: RegisterKey };

export type LabelJumpCommand = "jmp" | "jne" | "je" | "jge" | "jg" | "jle" | "jl";
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