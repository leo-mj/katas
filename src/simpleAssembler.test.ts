import { interpretStep, simpleAssembler } from "./simpleAssembler";

test.skip("simpleAssembler returns correct register", () => {
    expect(simpleAssembler(['mov a 5', 'inc a', 'dec a', 'dec a', 'jnz a -1', 'inc a'])).toStrictEqual({'a': 1});
    expect(simpleAssembler(['mov a -10', 'mov b a', 'inc a', 'dec b', 'jnz a -2'])).toStrictEqual({ 'a': 0, 'b': -20 })
})

test("interpretStep returns the correct object including command, registerKey and value", () => {
    expect(interpretStep('mov a 5')).toStrictEqual({command: "mov", registerKey: "a", value: "5"});
    expect(interpretStep('jnz a -1')).toStrictEqual({command: "jnz", registerKey: "a", value: "-1"});
    expect(interpretStep('inc a')).toStrictEqual({command: "inc", registerKey: "a", value: "1"});
})