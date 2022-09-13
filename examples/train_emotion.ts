import { DataType, DataTypeArray } from "../deps.ts";
import { DenseLayer, NeuralNetwork } from "../mod.ts";

const character = (string: string): Float32Array =>
  Float32Array.from(string.trim().split("").map(integer));

const integer = (character: string): number => character === "#" ? 1 : 0;

const happy = character(
  "....................#################...................." +
    "...............######...............######..............." +
    "...........####...........................####..........." +
    "........####.................................###........." +
    "......###.......................................###......" +
    ".....##...........###...............###...........##....." +
    "...##...........#######...........#######..........###..." +
    "..##............#######...........#######............##.." +
    ".##.............#######...........#######.............##." +
    ".##...............###...............###...............##." +
    "##.....................................................##" +
    "##.....................................................##" +
    "##.....................................................##" +
    ".##...................................................##." +
    ".##......##...................................##......##." +
    "..##.......###.............................###.......##.." +
    "...###.......####.......................####.......###..." +
    ".....##.........######.............######.........##....." +
    "......###............###############............###......" +
    "........####.................................####........" +
    "...........####...........................####..........." +
    "...............######...............######..............." +
    "....................#################....................",
);
const sad = character(
  "....................#################...................." +
    "...............######...............######..............." +
    "...........####...........................####..........." +
    "........####.................................###........." +
    "......###.......................................###......" +
    ".....##...........###...............###...........##....." +
    "...##...........#######...........#######..........###..." +
    "..##............#######...........#######............##.." +
    ".##.............#######...........#######.............##." +
    ".##...............###...............###...............##." +
    "##.....................................................##" +
    "##.....................................................##" +
    "##.....................................................##" +
    ".##...................................................##." +
    ".##.................#################.................##." +
    "..##............####..................####...........##.." +
    "...###.......####.......................####.......###..." +
    ".....##....###..............................###....##...." +
    "......#####....................................#####....." +
    "........####.................................####........" +
    "...........####...........................####..........." +
    "...............######...............######..............." +
    "....................#################....................",
);

const net = await new NeuralNetwork({
  silent: true,
  hidden: [
    new DenseLayer({ size: 10, activation: "sigmoid" }),
  ],
  cost: "crossentropy",
  output: new DenseLayer({ size: 1, activation: "sigmoid" }),
}).setupBackend("cpu");

net.train(
  [
    { inputs: happy, outputs: ["a".charCodeAt(0) / 255] },
    { inputs: sad, outputs: ["b".charCodeAt(0) / 255] },
  ],
  5000,
  1,
  0.1,
);

console.log(toChar(net.predict(happy))); // 😀
console.log(toChar(net.predict(sad))); // 😔

function toChar<T extends DataType>(x: DataTypeArray<T>) {
  const str = String.fromCharCode(Math.round(x[0] * 255));
  return str === "a" ? "😀" : str === "b" ? "😔" : str;
}
