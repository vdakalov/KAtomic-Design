import Asset from '../asset.mjs';

export default class TextAsset extends Asset {
  constructor(path) {
    super(path);

    /**
     *
     * @type {undefined|string}
     */
    this.value = undefined;

    window
      .fetch(this.path)
      .then(response => response.text())
      .then(value => {
        this.value = this.prepare(value);
        this.onload(this.value);
      })
      .catch(this.onerror);
  }

  /**
   *
   * @param {string} value
   * @returns {*}
   * @protected
   */
  prepare(value) {
    return value;
  }
}
