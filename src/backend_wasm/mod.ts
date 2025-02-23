import { WASMBackend } from "./backend.ts";
import { NoBackendError } from "../core/api/error.ts";
import { Engine } from "../core/engine.ts";
import { Tensor } from "../core/tensor/tensor.ts";
import { Backend, BackendType, NetworkConfig } from "../core/types.ts";
import { WASMTensorBackend } from "./tensor.ts";
import { NetworkJSON } from "../model/types.ts";
import { instantiate } from "./lib/netsaur.generated.js";

export class WASMInstance {
  static initialized = false;

  static async init(silent = false) {
    if (WASMInstance.initialized) return true;
    await instantiate();
    WASMInstance.initialized = true;
    if (!silent) console.log("WASM Backend Initialised");
    return true;
  }
}

export class WASMBackendLoader {
  async setup(silent = false) {
    Tensor.backend = new WASMTensorBackend();
    Engine.type = BackendType.WASM;
    return await WASMInstance.init(silent);
  }

  loadBackend(config: NetworkConfig): Backend {
    if (!WASMInstance.initialized) {
      throw new NoBackendError(BackendType.WASM)
    }
    return new WASMBackend(config);
  }

  fromJSON(json: NetworkJSON): Backend {
    return WASMBackend.fromJSON(json) as Backend;
  }
}

export const WASM = new WASMBackendLoader();
