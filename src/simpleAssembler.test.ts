import { simpleAssembler } from "./simpleAssembler";

test("simpleAssembler returns correct register", () => {
    expect(simpleAssembler(['mov a 5', 'inc a', 'dec a', 'dec a', 'jnz a -1', 'inc a'])).toStrictEqual({'a': 1});
    expect(simpleAssembler(['mov a -10', 'mov b a', 'inc a', 'dec b', 'jnz a -2'])).toStrictEqual({ 'a': 0, 'b': -20 })
})