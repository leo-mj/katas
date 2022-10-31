import { Dictionary, ExecutionReturns, Instruction } from "./assemblerTypes";

export function executeLine(linePointer: number, programLines: Instruction[], dictionary: Dictionary): ExecutionReturns {
    const currentLine: Instruction = programLines[linePointer];
    
    return {nextLine, returnValue}
}