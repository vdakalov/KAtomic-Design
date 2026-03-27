import IniAsset from '../../libs/asset/ini.mjs';
import Levels from '../../libs/levels.mjs';

/**
 * @property {Levels} value
 * @property {Promise<Levels>} promise
 */
export default class DefaultLevelsAsset extends IniAsset {
  constructor(name) {
    super(`/levels/${name}.dat`);
  }

  /**
   *
   * @param {string} value
   * @returns {Levels}
   */
  prepare(value) {
    const ini = super.prepare(value);
    return new Levels(ini);
  }
}
