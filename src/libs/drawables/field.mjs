import Drawable from '../drawable.mjs';

/**
 * Control game field and sync it with board image
 */
export default class FieldDrawable extends Drawable {

  /**
   *
   * @param {Application} application
   * @param {number} [rows=15]
   * @param {number} [columns=15]
   */
  constructor(application, rows = 15, columns = 15) {
    super(application);

    /**
     *
     * @type {number}
     * @readonly
     */
    this.rows = rows;

    /**
     *
     * @type {number}
     * @readonly
     */
    this.columns = columns;

    /**
     *
     * @type {RectsEnteringResult}
     * @private
     */
    this.en = Drawable.createInitialRectsEnteringResult();

    /**
     * Relative field margin
     * @type {number}
     * @private
     * @readonly
     */
    this.fieldMargin = 0.012;

    /**
     * Relative field left offset on board
     * @type {number}
     * @readonly
     * @private
     */
    this.fieldLeftPadding = 0.028 + this.fieldMargin;

    /**
     * Relative field left offset on board
     * @type {number}
     * @readonly
     * @private
     */
    this.fieldWidth = 0.7 - this.fieldLeftPadding - this.fieldMargin;

    /**
     * @typedef {Object} FieldDrawableCell
     * @property {number} index
     * @property {number} row
     * @property {number} column
     * @property {number} x
     * @property {number} y
     * @property {FieldDrawableCell|undefined} up
     * @property {FieldDrawableCell|undefined} left
     * @property {FieldDrawableCell|undefined} right
     * @property {FieldDrawableCell|undefined} down
     */
    /**
     *
     * @type {FieldDrawableCell[]}
     * @readonly
     */
    this.cells = new Array(this.rows * this.columns)
      .fill(null)
      .map((_, index) => ({
        index,
        row: Math.floor(index / this.columns),
        column: index % this.columns,
        x: -1,
        y: -1,
        up: undefined,
        left: undefined,
        right: undefined,
        down: undefined
      }));

    /**
     *
     * @type {number}
     */
    this.cellSize = 0;

    // define neighborhood
    for (const [i, cell] of this.cells.entries()) {
      if ((i % this.columns) !== 0) {
        cell.left = this.cells[i - 1];
      }
      if (i > this.columns - 1) {
        cell.up = this.cells[i - this.columns];
      }
      if ((i % this.columns) !== this.columns - 1) {
        cell.right = this.cells[i + 1];
      }
      if (this.cells.length - this.columns > i) {
        cell.down = this.cells[i + this.columns];
      }
    }
  }

  /**
   * Returns cell by specified point position
   * @param {number} x
   * @param {number} y
   * @returns {FieldDrawableCell|undefined}
   */
  getCellByPoint(x, y) {
    if (x >= this.en.ix && this.en.ix + this.en.iwp > x && y >= this.en.iy && this.en.iy + this.en.iwp > y) {
      x -= this.en.ix;
      y -= this.en.iy;
      const c = Math.floor(x / this.cellSize);
      const r = Math.floor(y / this.cellSize);
      const i = r * this.columns + c;
      return this.cells[i];
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {number} delay
   * @returns {void}
   */
  _draw(c, delay) {
    const board = this.application.board;
    // main board field position and size
    const fx = board.x + (board.width * this.fieldLeftPadding);
    const fy = board.y + (board.height * this.fieldMargin * 2);
    const fw = (board.width * this.fieldWidth);
    const fh = board.height - (board.height * (this.fieldMargin * 4));

    // define cell size and cells rect sizes
    this.cellSize = Math.min(fw / this.columns, fh / this.rows);
    const crw = this.cellSize * this.columns;
    const crh = this.cellSize * this.rows;

    // enter cells rect into board main-field
    this.en = this.enterRects(fw, fh, crw, crh);
    this.en.ix += fx;
    this.en.iy += fy;

    // c.beginPath();
    // c.strokeStyle = 'red';
    // c.strokeRect(fx, fy, fw, fh);
    // c.closePath();

    // c.beginPath();
    // c.strokeStyle = 'green';
    // c.strokeRect(this.en.ix, this.en.iy, this.en.iwp, this.en.ihp);
    // c.closePath();

    // for (let i = 1; i < this.rows; i++) {
    //   const y = this.en.iy + (this.cellSize * i);
    //   c.beginPath();
    //   c.moveTo(this.en.ix, y);
    //   c.lineTo(this.en.ix + this.en.iwp, y);
    //   c.stroke();
    //   c.closePath();
    // }

    // for (let i = 1; i < this.columns; i++) {
    //   const x = this.en.ix + (this.cellSize * i);
    //   c.beginPath();
    //   c.moveTo(x, this.en.iy);
    //   c.lineTo(x, this.en.iy + this.en.ihp);
    //   c.stroke();
    //   c.closePath();
    // }

    for (let i = 0, r = 0, C = 0, x = this.en.ix, y = this.en.iy; i < this.cells.length; i++, C++, x += this.cellSize) {
      if (C === this.columns) {
        C = 0;
        x = this.en.ix;
        r++;
        y += this.cellSize;
      }
      const cell = this.cells[i];
      cell.x = x;
      cell.y = y;
    }
  }
}
