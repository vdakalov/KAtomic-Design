import { Renderer } from '../render.mjs';
import BoardImageAsset from '../../assets/images/board.mjs';

export default class BoardRenderer extends Renderer {

  /**
   * Board image offset from left of canvas
   * @return {number}
   */
  get x() {
    return this.en.ix;
  }

  /**
   * Board image offset from top of canvas
   * @return {number}
   */
  get y() {
    return this.en.iy;
  }

  /**
   * Board image actual width
   * @return {number}
   */
  get width() {
    return this.en.iwp;
  }

  /**
   * Board image actual height
   * @return {number}
   */
  get height() {
    return this.en.ihp;
  }

  /**
   *
   * @param {number} padding Padding for board image in canvas
   */
  constructor(padding = 0.02) {
    super();
    this.enabled = false;

    /**
     *
     * @type {BoardImageAsset}
     * @readonly
     */
    this.asset = new BoardImageAsset();
    this.asset.promise
      .then(() => this.enabled = true);

    /**
     *
     * @type {number}
     */
    this.padding = padding;

    /**
     * Entering data
     * @type {RectsEnteringResult}
     * @private
     */
    this.en = Renderer.createInitialRectsEnteringResult();
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {number} delay
   * @returns {undefined}
   */
  draw(c, delay) {
    this.en = this.enterRects(c.canvas.width, c.canvas.height, this.asset.width, this.asset.height, this.padding);

    c.drawImage(this.asset.element,
      0, 0, this.asset.width, this.asset.height,
      this.en.ix, this.en.iy, this.en.iwp, this.en.ihp);
  }
}
