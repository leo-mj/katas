import { GeneticAlgorithm } from "./binaryGeneticAlgorithms";

test("binaryGeneticAlgorithms returns the correct chromosome", () => {
  const test1: GeneticAlgorithm = new GeneticAlgorithm([1, 2, 3], 1, 6);
  expect(test1.run(0.6, 0.002, 100)).toBe("011");

  const test2: GeneticAlgorithm = new GeneticAlgorithm([1, 2, 3, 4, 5], 10, 6);
  expect(test2.run(0.6, 0.002, 100)).toBe("01100");

  const test3: GeneticAlgorithm = new GeneticAlgorithm(
    [1, 2, 3, 4, 5, 2479],
    15,
    2479,
  );
  expect(test3.run(0.6, 0.002, 100)).toBe("000001");
});
