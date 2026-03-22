
/**
 * @type {Array<Drawable|Drawable[]>}
 */
export default class Scene extends Array {

  /**
   *
   * @param {Application} application
   */
  constructor(application) {
    super();

    /**
     *
     * @type {Application}
     * @readonly
     */
    this.application = application;

    this.application.raf.push(this.draw.bind(this));
  }

  /**
   *
   * @param {Drawable} object
   * @param {number} delay
   * @returns {void}
   * @private
   */
  proc(object, delay) {
    if (object.enabled !== false) {
      object.draw(delay);
    }
  }

  /**
   *
   * @param {number} delay
   * @returns {void}
   */
  draw(delay) {
    for (const item of this) {
      if (Array.isArray(item)) {
        for (const sub of item) {
          this.proc(sub, delay);
        }
      } else {
        this.proc(item, delay);
      }
    }
  }
}
