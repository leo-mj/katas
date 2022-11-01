import { Instruction } from "./assemblerUtils/assemblerTypes";
import { parseCommand } from "./parseProgramUtils/parseCommand";

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
  const splitLine: string[] = trimmedLine.split(" ");
  const commandWithArgs: Instruction = parseCommand(splitLine);
  return commandWithArgs;
}
