/**
 * @type {Array<Function>}
 */
export default class Raf extends Array {
  constructor() {
    super();
    /**
     *
     * @type {undefined|number}
     * @private
     */
    this.id = undefined;
    /**
     *
     * @type {number}
     */
    this.ts = 0;
    this.tick = this.tick.bind(this);
  }

  /**
   *
   * @param {number} time
   * @returns {void}
   */
  tick(time) {
    const delay = time - this.ts;
    this.ts = time;
    for (const func of this) {
      func(delay);
    }
    this.id = window.requestAnimationFrame(this.tick);
  }

  pause() {
    if (this.id !== undefined) {
      window.cancelAnimationFrame(this.id);
      this.id = undefined;
    }
  }

  resume() {
    if (this.id === undefined) {
      this.ts = window.performance.now();
      this.tick(this.ts);
    }
  }
}
