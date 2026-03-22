/**
 *
 * @type {Object.<string, Asset>}
 */
const stash = {};

/**
 *
 * @enum {number}
 * @readonly
 */
const State = {
  /**
   * Unable to load asset
   */
  Failure: 0,
  /**
   * Loading
   */
  Pending: 1,
  /**
   * Asset has been loaded
   */
  Successful: 2
};

/**
 * Abstract class to control asset loading
 * @abstract
 * @constructor
 */
export default class Asset {

  /**
   * Asset not loaded (error)
   * @returns {boolean}
   */
  get isFailed() {
    return this.state === State.Failure;
  }

  /**
   * Asset in loading now
   * @returns {boolean}
   */
  get isLoading() {
    return this.state === State.Pending;
  }

  /**
   * Asset loaded successfully
   * @returns {boolean}
   */
  get isLoaded() {
    return this.state === State.Successful;
  }

  /**
   *
   * @param {string} path Path to asset relative to /asset (e.g. "/images/img.png")
   */
  constructor(path) {
    // singleton
    if (stash.hasOwnProperty(this.constructor.name)) {
      return stash[this.constructor.name];
    }
    stash[this.constructor.name] = this;

    /**
     *
     * @type {string}
     * @readonly
     */
    this.path = `/assets${path}`;
    /**
     *
     * @type {Promise<unknown>}
     * @readonly
     */
    this.promise = new Promise((resolve, reject) => {
      this.onload = this.onload.bind(this, resolve);
      this.onerror = this.onerror.bind(this, reject);
    });
    /**
     * Asset loading state
     * @type {State}
     * @private
     */
    this.state = State.Pending;
  }

  /**
   * Should be called when asset load successfully
   * @param {Function} [func] Promise resolve function
   * @param {*} [value]
   * @returns {void}
   * @protected
   */
  onload(func, value) {
    this.state = State.Successful;
    func(value);
  }

  /**
   * Should be called when asset wasn't loaded
   * @param {Function} [func] Promise reject function
   * @param {Error} [error]
   * @returns {void}
   * @protected
   */
  onerror(func, error) {
    this.state = State.Failure;
    if (error === undefined) {
      error = new Error(`Unable to load ${
        this.constructor.name} from ${this.path}`);
    }
    func(error);
  }
}
