import {
  Activation,
  Cost,
  CPU,
  DenseLayer,
  NeuralNetwork,
  setupBackend,
  tensor2D,
} from "../mod.ts";

const testData = [20, 40, 43, 87, 43];
// deno-lint-ignore no-explicit-any
function fmt(input: any) {
  return (input.data as Float32Array).map((e: number) => Math.round(e))[0];
}
await setupBackend(CPU);

const network = new NeuralNetwork({
  size: [4, 1],
  silent: true,
  layers: [
    DenseLayer({ size: [3], activation: Activation.Linear }),
    DenseLayer({ size: [1], activation: Activation.Linear }),
  ],
  cost: Cost.MSE,
});

const start = performance.now();

network.train(
  [
    {
      // y = 2x + 1
      inputs: tensor2D([[1], [2], [3], [4]]),
      outputs: tensor2D([[3], [5], [7], [9]]),
    },
  ],
  500,
  0.01,
);

console.log("training time", performance.now() - start, " milliseconds");
console.log("y = 2x + 1");

for (const test of testData) {
  console.log(
    `
input: ${test}
output: ${fmt(await network.predict(tensor2D([[test]])))}`,
  );
}
