/**
 * Control canvas element
 */
export default class Canvas {

  /**
   *
   * @returns {number}
   */
  get width() {
    return this.element.width;
  }

  /**
   *
   * @param {number} value
   */
  set width(value) {
    this.element.width = value;
  }

  /**
   *
   * @returns {number}
   */
  get height() {
    return this.element.height;
  }

  /**
   *
   * @param {number} value
   */
  set height(value) {
    this.element.height = value;
  }

  constructor() {
    /**
     *
     * @type {HTMLCanvasElement}
     * @readonly
     */
    this.element = window.document.createElement('canvas');

    /**
     *
     * @type {CanvasRenderingContext2D}
     * @readonly
     */
    this.context = this.element.getContext('2d');

    // listen to window resize event
    window.addEventListener('resize', this.adjustSize.bind(this));
  }

  /**
   * Make canvas buffer size equals to canvas element actual size
   * @returns {void}
   */
  adjustSize() {
    if (this.element.offsetWidth !== this.element.width) {
      this.element.width = this.element.offsetWidth;
    }
    if (this.element.offsetHeight !== this.element.height) {
      this.element.height = this.element.offsetHeight;
    }
  }
}
