import { Data, DenseLayer, NeuralNetwork, setupBackend } from "../mod.ts";
import { Matrix, Native } from "../backends/native/mod.ts";

await setupBackend(Native);

const data = await Data.csv(
  "https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv",
  {
    columns: {
      medv: {
        label: true,
      },
    },
  },
);

// data.inputs = data.inputs.div(100);
// data.outputs = data.outputs.div(100);

const network = new NeuralNetwork({
  input: [data.inputs.cols, 1],
  layers: [
    DenseLayer({ size: [1], activation: "sigmoid" }),
  ],
  cost: "mse",
});

await network.train([data], 10, data.inputs.rows, 0.01);

const predInput = new Matrix(
  1,
  data.inputs.cols,
  (data.inputs.data as Float32Array).subarray(0, data.inputs.cols),
);
console.log(predInput);

console.log(
  await network.predict(
    predInput,
  ),
  "vs",
  data.outputs.data[0],
);
