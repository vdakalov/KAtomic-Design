import ImageAsset from '../../libs/asset/image.mjs';

/**
 *
 * @type {Object.<string, number[] | Object.<string, number[]>>}
 * @readonly
 */
export const map = {
//char [  x,   y,  w,  h]
  '#': [467,  94, 42, 40],
  arrow: {
    'u': [471, 159, 35, 35],
    'd': [473, 204, 35, 35],
    'r': [473, 251, 35, 35],
    'l': [470, 299, 35, 35],
  },
  atom: {
    '1': [ 64,  41, 35, 35],
    '2': [110,  41, 35, 35],
    '3': [155,  41, 35, 35],
    '4': [200,  41, 35, 35],
    '5': [243,  41, 35, 35],
    '6': [290,  41, 35, 35],
    '7': [336,  41, 35, 35],
    '8': [383,  41, 35, 35],
    '9': [431,  41, 35, 35],
    '0': [478,  41, 35, 35],
    'o': [411,  99, 35, 35],
  },
  bound: {
    'a': [ 68, 205, 35, 35], // single top
    'b': [115,  99, 35, 35], // single top-right
    'c': [156, 208, 35, 35], // single right
    'd': [198, 211, 35, 35], // single bot-right
    'e': [ 68, 182, 35, 35], // single bottom
    'f': [274, 211, 35, 35], // single bot-left
    'g': [316, 209, 35, 35], // single left
    'h': [359, 206, 35, 35], // single top-left
    'A': [ 68, 245, 35, 35], // double top
    'B': [114, 248, 35, 35], // double right
    'C': [152, 251, 35, 35], // double bottom
    'D': [190, 248, 35, 35], // double left
    'E': [236, 245, 35, 35], // triple top
    'F': [282, 249, 35, 35], // triple right
    'G': [230, 246, 35, 35], // triple bottom
    'H': [359, 249, 35, 35], // triple left
  },
  flask: {
    'E': [423, 147, 35, 35],
    'F': [376, 147, 35, 35],
    'G': [328, 147, 35, 35],
    'H': [282, 146, 35, 35],
    'I': [236, 147, 35, 35],
    'J': [187, 146, 35, 35],
    'K': [134, 147, 35, 35],
    'L': [ 85, 148, 35, 35],
  },
};


export default class SpriteImageAsset extends ImageAsset {
  constructor() {
    super('sprite.png');
  }
}
