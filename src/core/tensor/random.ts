export class Random {
  static #y2 = 0;
  static #previous_gaussian = false;
  static #randomStateProp = "_lcg_random_state";
  static #m = 4294967296;
  static #a = 1664525;
  static #c = 1013904223;

  static lcg(stateProperty: string) {
    // deno-lint-ignore no-explicit-any
    (Random as any)[stateProperty] =
      // deno-lint-ignore no-explicit-any
      (Random.#a * (Random as any)[stateProperty] + Random.#c) % Random.#m;
    // deno-lint-ignore no-explicit-any
    return (Random as any)[stateProperty] / Random.#m;
  }

  static #lcgSeed(stateProperty: string, val = Math.random() * Random.#m) {
    // deno-lint-ignore no-explicit-any
    (Random as any)[stateProperty] = val >>> 0;
  }

  static setSeed(seed: number) {
    Random.#lcgSeed(Random.#randomStateProp, seed);
    Random.#previous_gaussian = false;
  }

  static random(min?: number | number[], max?: number | number[]): number {
    let rand;
    // deno-lint-ignore no-explicit-any
    if ((Random as any)[Random.#randomStateProp] != null) {
      rand = Random.lcg(Random.#randomStateProp);
    } else {
      rand = Math.random();
    }
    if (typeof min === "undefined") {
      return rand;
    } else if (typeof max === "undefined") {
      if (min instanceof Array) {
        return min[Math.floor(rand * min.length)];
      } else {
        return rand * min;
      }
    } else {
      if (min > max) {
        const tmp = min;
        min = max;
        max = tmp;
      }
      return rand * ((max as number) - (min as number)) + (min as number);
    }
  }

  static gaussian(mean: number, standard_deviation = 1) {
    // deno-lint-ignore prefer-const
    let y1, x1, x2, w;
    // if (Random.#previous_gaussian) {
    //   y1 = Random.#y2;
    // } else {
    do {
      x1 = this.random(2) - 1;
      x2 = this.random(2) - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt(-2 * Math.log(w) / w);
    y1 = x1 * w;
    //   Random.#y2 = x2 * w;
    //   Random.#previous_gaussian = true;
    // }

    const m = mean || 0;
    return y1 * standard_deviation + m;
  }
}

export function swap<T>(
  object: { [index: number]: T },
  left: number,
  right: number,
) {
  const temp = object[left];
  object[left] = object[right];
  object[right] = temp;
}

export function shuffle(
  // deno-lint-ignore no-explicit-any
  array: any[] | Uint32Array | Int32Array | Float32Array,
): void {
  let counter = array.length;
  let index = 0;
  while (counter > 0) {
    index = (Math.random() * counter) | 0;
    counter--;
    swap(array, counter, index);
  }
}

export function shuffleCombo(
  // deno-lint-ignore no-explicit-any
  array: any[] | Uint32Array | Int32Array | Float32Array,
  // deno-lint-ignore no-explicit-any
  array2: any[] | Uint32Array | Int32Array | Float32Array,
): void {
  if (array.length !== array2.length) {
    throw new Error(
      `Array sizes must match to be shuffled together ` +
        `First array length was ${array.length}` +
        `Second array length was ${array2.length}`,
    );
  }
  let counter = array.length;
  let index = 0;
  while (counter > 0) {
    index = (Math.random() * counter) | 0;
    counter--;
    swap(array, counter, index);
    swap(array2, counter, index);
  }
}

export function createShuffledIndices(n: number): Uint32Array {
  const shuffledIndices = new Uint32Array(n);
  for (let i = 0; i < n; ++i) {
    shuffledIndices[i] = i;
  }
  shuffle(shuffledIndices);
  return shuffledIndices;
}

export function randUniform(a: number, b: number) {
  const r = Math.random();
  return (b * r) + (1 - r) * a;
}

export const randomWeight = (): number => Math.random() * 0.4 - 0.2;

export const randomFloat = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const gaussRandom = (): number => {
  if (gaussRandom.returnV) {
    gaussRandom.returnV = false;
    return gaussRandom.vVal;
  }
  const u = 2 * Math.random() - 1;
  const v = 2 * Math.random() - 1;
  const r = u * u + v * v;
  if (r === 0 || r > 1) {
    return gaussRandom();
  }
  const c = Math.sqrt((-2 * Math.log(r)) / r);
  gaussRandom.vVal = v * c;
  gaussRandom.returnV = true;
  return u * c;
};
gaussRandom.returnV = false;
gaussRandom.vVal = 0;

export const randomInteger = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

export const randomN = (mu: number, std: number): number =>
  mu + gaussRandom() * std;
export const max = (
  values:
    | Float32Array
    | {
      [key: string]: number;
    },
): number =>
  (Array.isArray(values) || values instanceof Float32Array)
    ? Math.max(...values)
    : Math.max(...Object.values(values));
