import TextAsset from '../asset/text.mjs';
import Ini from '../ini.mjs';

export default class IniAsset extends TextAsset {
  /**
   *
   * @param {string} value
   * @returns {Ini}
   * @protected
   */
  prepare(value) {
    return new Ini(value);
  }
}
