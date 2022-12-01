export interface GeneticAlgorithm {
  numberArr: number[];
  idealSum: number;
  idealProduct: number;
}
export class GeneticAlgorithm {
  constructor(numberArr: number[], idealSum: number, idealProduct: number) {
    this.numberArr = numberArr;
    this.idealSum = idealSum;
    this.idealProduct = idealProduct;
  }
  fitness(chromosome: string) {
    let chromosomeSum: number = 0;
    let chromosomeProduct: number = 0;
    for (let i = 0; i < chromosome.length; i++) {
      const digit: string = chromosome[i];
      if (digit === "0") {
        chromosomeSum += this.numberArr[i];
      } else if (digit === "1") {
        chromosomeProduct *= this.numberArr[i];
      }
    }
    return Math.sqrt(
      Math.pow(chromosomeSum - this.idealSum, 2) +
        Math.pow(chromosomeProduct - this.idealProduct, 2),
    );
  }
  generate(length: number) {
    const possibilities: string[] = ["0", "1"];
    const population: string[] = [];
    while (population.length < 100) {
      let chromosome = "";
      while (chromosome.length < length) {
        const nextDigit: string = possibilities[Math.round(Math.random())];
        chromosome += nextDigit;
      }
      population.push(chromosome);
    }
    return population;
  }

  select(population: string[], fitnesses: number[]): string {
    const sumOfFitnesses: number = fitnesses.reduce(
      (fitness, totalFitness) => fitness + totalFitness,
    );
    const randomSelectionNumber: number = Math.random();
    let cdf: number = 0;
    for (let i = 0; i < population.length; i++) {
      const chromosome: string = population[i];
      const fitness: number = fitnesses[i];
      const proportionalFitness: number = fitness / sumOfFitnesses;
      cdf += proportionalFitness;
      if (cdf >= randomSelectionNumber) {
        return chromosome;
      }
    }
    return population[0];
  }

  mutate(chromosome: string, p: number): string {
    let mutatedChromosome: string = "";
    for (const digit of chromosome) {
      let digitToAdd: string = digit;
      const randomSelectionNumber: number = Math.random();
      if (randomSelectionNumber <= p) {
        digitToAdd === "0" ? (digitToAdd = "1") : (digitToAdd = "0");
      }
      mutatedChromosome += digitToAdd;
    }
    return mutatedChromosome;
  }

  crossover(chromosome1: string, chromosome2: string, p: number): string[] {
    const randomSelectionNumber: number = Math.random();
    if (randomSelectionNumber > p) return [chromosome1, chromosome2];
    const crossOverIndex: number = Math.floor(
      Math.random() * chromosome1.length,
    );
    const first: string =
      chromosome1.substring(0, crossOverIndex) +
      chromosome2.substring(crossOverIndex);
    const second: string =
      chromosome2.substring(0, crossOverIndex) +
      chromosome1.substring(crossOverIndex);
    return [first, second];
  }

  run(
    fitness: (chromosome: string) => number,
    length: number,
    p_c: number,
    p_m: number,
    iterations = 100,
  ) {
    let population: string[] = this.generate(length);
    for (let i = 0; i < iterations; i++) {
      const fitnesses: number[] = population.map(fitness);
      let newPopulation: string[] = [];
      while (newPopulation.length < population.length) {
        let [chromosome1, chromosome2]: string[] = [
          this.select(population, fitnesses),
          this.select(population, fitnesses),
        ];
        [chromosome1, chromosome2] = this.crossover(
          chromosome1,
          chromosome2,
          p_c,
        );
        chromosome1 = this.mutate(chromosome1, p_m);
        chromosome2 = this.mutate(chromosome2, p_m);
        newPopulation.push(chromosome1, chromosome2);
      }
      population = newPopulation;
    }
    let maxFitness: number = 0;
    let fittestChromosome: string = population[0];
    for (const chromosome of population) {
      const currentFitness: number = fitness(chromosome);
      if (currentFitness > maxFitness) {
        maxFitness = currentFitness;
        fittestChromosome = chromosome;
      }
    }
    return fittestChromosome;
  }
}
