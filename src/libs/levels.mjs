/**
 *
 * @enum {string}
 * @readonly
 */
export const AtomCharNameMap = {
  '1': 'H',
  '2': 'C',
  '3': 'O',
  '4': 'N',
  '5': 'S',
  '6': 'F',
  '7': 'Cl',
  '8': 'Br',
  '9': 'P',
  '0': 'J',
  'o': 'Crystal',
};

/**
 *
 * @enum {number}
 * @readonly
 */
export const BoundNameBitMap = {
  Single: 0b010000,
  Double: 0b100000,
  Triple: 0b110000,
  Top:    0b000001,
  Left:   0b000010,
  Right:  0b000100,
  Bottom: 0b001000,
};

/**
 * bits: 654321
 * 1 - top
 * 2 - left
 * 3 - right
 * 4 - bottom
 * 5,6 - 01:single, 10:double or 11:triple
 * @enum {number}
 * @readonly
 */
export const BondCharBitsMap = {
  'a': 0b010001, // 'single top',
  'b': 0b010101, // 'single top-right',
  'c': 0b010100, // 'single right',
  'd': 0b011100, // 'single bot-right',
  'e': 0b011000, // 'single bottom',
  'f': 0b011010, // 'single bot-left',
  'g': 0b010010, // 'single left',
  'h': 0b010011, // 'single top-left',
  'A': 0b100001, // 'double top',
  'B': 0b100100, // 'double right',
  'C': 0b101000, // 'double bottom',
  'D': 0b100010, // 'double left',
  'E': 0b110001, // 'triple top',
  'F': 0b110100, // 'triple right',
  'G': 0b111000, // 'triple bottom',
  'H': 0b110010, // 'triple left',
};

class LangProp {
  /**
   *
   * @param {Object} data
   */
  constructor(data) {
    /**
     *
     * @type {Object}
     * @readonly
     */
    this.data = data;
  }

  /**
   *
   * @param {string} key
   * @param {string} lang
   * @returns {string}
   */
  getProp(key, lang = '') {
    if (typeof this.data === 'string') {
      return this.data;
    }
    if (typeof this.data !== 'object' || this.data == null) {
      return '';
    }
    if (typeof this.data[key] === 'string') {
      return this.data[key];
    }
    if (typeof this.data[key] !== 'object' || this.data[key] == null) {
      return '';
    }
    return this.data[key][lang] || this.data[''] || '';
  }
}

export class Set extends LangProp {

  /**
   *
   * @param {string} [lang]
   * @returns {string}
   */
  getName(lang) {
    return this.getProp('name', lang);
  }

  /**
   *
   * @param {string} lang
   * @returns {string}
   */
  getDescription(lang) {
    return this.getProp('description', lang);
  }

  /**
   *
   * @param {string} [lang]
   * @returns {string}
   */
  getAuthor(lang) {
    return this.getProp('author', lang);
  }

  /**
   *
   * @param {string} [lang]
   * @returns {string}
   */
  getAuthorEmail(lang) {
    return this.getProp('authoremail', lang);
  }

  /**
   *
   * @param {string} [lang]
   * @returns {number|undefined}
   */
  getLevelCount(lang) {
    const value = this.getProp('levelcount', lang);
    if (value === '') {
      return undefined;
    }
    return Number.parseInt(value);
  }
}

export class Bound {

  get single() {
    return this.bits & BoundNameBitMap.Single === BoundNameBitMap.Single;
  }

  get double() {
    return this.bits & BoundNameBitMap.Double === BoundNameBitMap.Double;
  }

  get triple() {
    return this.bits & BoundNameBitMap.Triple === BoundNameBitMap.Triple;
  }

  /**
   *
   * @param {string} char
   */
  constructor(char) {
    /**
     *
     * @type {string}
     * @readonly
     */
    this.char = char;

    /**
     * @type {number}
     * @readonly
     */
    this.bits = BondCharBitsMap[this.char];
  }
}

export class Atom {

  /**
   *
   * @param {string} value
   */
  constructor(value) {
    /**
     *
     * @type {string}
     * @readonly
     */
    this.value = value;

    const [char, bonds] = this.value.split('-');

    /**
     *
     * @type {string}
     * @readonly
     */
    this.char = char;

    /**
     * @type {string}
     * @readonly
     */
    this.charName = AtomCharNameMap[this.char];

    /**
     *
     * @type {Readonly<Bound[]>}
     * @readonly
     */
    this.bounds = bonds
      .split('')
      .map(char => new Bound(char), 0);
  }
}

export class Field {
  /**
   *
   * @param {string} value
   */
  constructor(value) {
    /**
     *
     * @type {string}
     * @readonly
     */
    this.value = value;
  }
}

export class Mole {
  /**
   *
   * @param {string} value
   */
  constructor(value) {
    /**
     *
     * @type {string}
     * @readonly
     */
    this.value = value;
  }
}

export class Level extends LangProp {
  /**
   *
   * @param {Object} data
   * @param {number} number
   */
  constructor(data, number) {
    super(data);
    /**
     *
     * @type {number}
     * @readonly
     */
    this.number = number;

    /**
     *
     * @type {Object.<string, Atom>}
     * @readonly
     */
    this.atom = {};

    /**
     *
     * @type {Field[]}
     * @readonly
     */
    this.field = [];

    /**
     *
     * @type {Mole[]}
     * @readonly
     */
    this.mole = [];

    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('atom_')) {
        const char = key.split('_').pop();
        this.atom[char] = new Atom(value);
      } else if (key.startsWith('feld_')) {
        const index = Number.parseInt(key.split('_').pop());
        if (!Number.isInteger(index)) {
          throw new Error(`Unable to parse feld index from key "${key}"`);
        }
        this.field[index] = new Field(value);
      } else if (key.startsWith('mole_')) {
        const index = Number.parseInt(key.split('_').pop());
        if (!Number.isInteger(index)) {
          throw new Error(`Unable to parse mole index from key "${key}"`);
        }
        this.mole[index] = new Mole(value);
      }
    }
  }

  /**
   *
   * @param {string} [lang]
   * @returns {string}
   */
  getName(lang) {
    return this.getProp('name', lang);
  }
}

export default class Levels {
  /**
   *
   * @param {Ini} ini
   */
  constructor(ini) {
    /**
     *
     * @type {Ini}
     * @readonly
     */
    this.ini = ini;

    /**
     *
     * @type {Set}
     * @readonly
     */
    this.set = new Set(this.ini.data['levelset']);

    /**
     *
     * @type {Level[]}
     * @readonly
     */
    this.levels = [];

    for (const [key, data] of Object.entries(this.ini.data)) {
      if (!/^level\d+$/.test(key)) {
        continue;
      }
      const number = Number.parseInt(key.slice(5, key.length));
      if (!Number.isInteger(number)) {
        console.warn(`Unable to parse level number from key ${key}. Skip.`);
        continue;
      }
      const level = new Level(data, number);
      this.levels.push(level);
    }
  }
}
