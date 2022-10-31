import { Dictionary } from "./assemblerTypes"
import { executeRegisterOperation } from "./executeLine";

test("executeRegisterOperation returns the correct dictionary", () => {
    const testDictionary: Dictionary = {};
    expect(executeRegisterOperation({command: "mov", targetReg: "a", regOrVal: 5}, testDictionary)).toStrictEqual({'a': 5});
})