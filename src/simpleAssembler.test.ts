import {
  executeInstructions,
  interpretStep,
  simpleAssembler,
  transformValueToNumber,
} from "./simpleAssembler";

test("simpleAssembler returns correct register", () => {
  expect(
    simpleAssembler([
      "mov a 5",
      "inc a",
      "dec a",
      "dec a",
      "jnz a -1",
      "inc a",
    ]),
  ).toStrictEqual({ a: 1 });
  expect(
    simpleAssembler(["mov a -10", "mov b a", "inc a", "dec b", "jnz a -2"]),
  ).toStrictEqual({ a: 0, b: -20 });
});

test("interpretStep returns the correct object including command, registerKey and value", () => {
  expect(interpretStep("mov a 5")).toStrictEqual({
    command: "mov",
    registerKey: "a",
    value: "5",
  });
  expect(interpretStep("jnz a -1")).toStrictEqual({
    command: "jnz",
    registerKey: "a",
    value: "-1",
  });
  expect(interpretStep("inc a")).toStrictEqual({
    command: "inc",
    registerKey: "a",
    value: "1",
  });
});

test("executeInstructions returns the correct dictionary object", () => {
  expect(
    executeInstructions([{ command: "mov", registerKey: "a", value: "5" }]),
  ).toStrictEqual({ a: 5 });
  expect(
    executeInstructions([
      { command: "mov", registerKey: "a", value: "2" },
      { command: "dec", registerKey: "a", value: "-1" },
      { command: "jnz", registerKey: "a", value: "-1" },
    ]),
  ).toStrictEqual({ a: 0 });
  expect(
    executeInstructions([
      { command: "mov", registerKey: "a", value: "2" },
      { command: "mov", registerKey: "b", value: "a" },
    ]),
  ).toStrictEqual({ a: 2, b: 2 });
});

test("transformValueToNumber returns the correct number", () => {
  expect(transformValueToNumber("-1", { a: 234 })).toBe(-1);
  expect(transformValueToNumber("a", { a: 234 })).toBe(234);
});
