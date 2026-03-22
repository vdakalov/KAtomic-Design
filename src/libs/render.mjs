/**
 * @abstract
 * @constructor
 * @property {boolean} [enabled=true] Should be rendered
 */
export class Renderer {

  /**
   * Creates and returns initial value of the object
   * @return {RectsEnteringResult}
   */
  static createInitialRectsEnteringResult() {
    return { op: 0, owp: 0, ohp: 0, iwp: 0, ihp: 0, ix: 0, iy: 0 };
  }

  /**
   * @typedef {Object} RectsEnteringResult
   * @property {number} op Absolute value of padding in px
   * @property {number} owp Outer rect width minus padding
   * @property {number} ohp Outer rect height minus padding
   * @property {number} iwp Inner rect width minus padding
   * @property {number} ihp Inner rect height minus padding
   * @property {number} ix Inner rect offset from left of outer rect
   * @property {number} iy Inner rect offset from top of outer rect
   */
  /**
   * Returns data for enter inner rect into outer one
   * @param ow Outer rect width
   * @param oh Outer rect height
   * @param iw Inner rect width
   * @param ih Inner rect height
   * @param [padding] Padding for outer rect
   * @return {RectsEnteringResult}
   */
  enterRects(ow, oh, iw, ih, padding = 0) {
    // define padding value relative to a quarter
    // of outer rectangle's perimeter
    const op = ((ow + oh) / 2) * padding;

    // outer rect sizes with padding
    const owp = ow - op;
    const ohp = oh - op;

    // find min side ratio
    const r = Math.min(owp / iw, ohp / ih);

    // inner rect sizes
    const iwp = iw * r;
    const ihp = ih * r;

    // inner rect absolute offsets
    const ix = (ow - iwp) / 2;
    const iy = (oh - ihp) / 2;

    return { op, owp, ohp, iwp, ihp, ix, iy };
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {number} delay
   * @abstract
   */
  draw(c, delay) {}
}

/**
 * @type {Array<Renderer|Renderer[]>}
 */
export default class Render extends Array {

  /**
   *
   * @param {Renderer} renderer
   * @param {CanvasRenderingContext2D} c
   * @param {number} delay
   * @returns {void}
   * @private
   */
  proc(renderer, c, delay) {
    if (renderer.enabled !== false) {
      renderer.draw(c, delay);
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {number} delay
   * @returns {void}
   */
  draw(c, delay) {
    for (const item of this) {
      if (Array.isArray(item)) {
        for (const sub of item) {
          this.proc(sub, c, delay);
        }
      } else {
        this.proc(item, c, delay);
      }
    }
  }
}
