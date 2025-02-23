import { Rank, Shape, Tensor } from "../../mod.ts";
import { BackendType, DataSet, NetworkConfig } from "../core/types.ts";
import { NetworkJSON } from "../model/types.ts";
import {
  wasm_backend_create,
  wasm_backend_predict,
  wasm_backend_train,
} from "./lib/netsaur.generated.js";
import { PredictOptions, TrainOptions } from "./utils.ts";

export class WASMBackend {
  config: NetworkConfig;
  outputShape?: Shape[Rank];

  constructor(config: NetworkConfig) {
    this.config = config;

    wasm_backend_create(JSON.stringify(config));
  }

  train(datasets: DataSet[], epochs: number, rate: number) {
    this.outputShape = datasets[0].outputs.shape.slice(1) as Shape[Rank];
    const buffer = [];
    for (const dataset of datasets) {
      buffer.push(dataset.inputs.data as Float32Array);
      buffer.push(dataset.outputs.data as Float32Array);
    }
    const options = JSON.stringify({
      datasets: datasets.length,
      inputShape: datasets[0].inputs.shape,
      outputShape: datasets[0].outputs.shape,
      epochs,
      rate,
    } as TrainOptions);

    wasm_backend_train(buffer, options);
  }

  //deno-lint-ignore require-await
  async predict(
    input: Tensor<Rank, BackendType>,
  ): Promise<Tensor<Rank, BackendType>> {
    const options = JSON.stringify({
      inputShape: input.shape,
      outputShape: this.outputShape,
    } as PredictOptions);
    const output = wasm_backend_predict(input.data as Float32Array, options);
    return new Tensor(output, this.outputShape!);
  }

  save(_input: string): void {}

  //deno-lint-ignore require-await
  async toJSON() {
    return null as unknown as NetworkJSON;
  }

  static fromJSON(_json: NetworkJSON): WASMBackend {
    return null as unknown as WASMBackend;
  }
}
