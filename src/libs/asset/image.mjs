import Asset from '../asset.mjs';

export default class ImageAsset extends Asset {

  /**
   * Image width
   * @returns {number}
   */
  get width() {
    return this.element.width;
  }

  /**
   * Image height
   * @returns {number}
   */
  get height() {
    return this.element.height;
  }

  /**
   *
   * @param {string} name Image name relative to "/asset/images/" (e.g. "board.jpg")
   */
  constructor(name) {
    super(`/images/${name}`);
    /**
     *
     * @type {HTMLImageElement}
     * @readonly
     */
    this.element = window.document.createElement('img');
    this.element.src = this.path;
    this.element.addEventListener('load', this.onload);
    this.element.addEventListener('error', this.onerror);
  }
}
