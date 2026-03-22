import { Renderer } from '../render.mjs';

/**
 * Control cell info
 */
export class Cell {

  /**
   *
   * @param {number} index
   */
  constructor(index) {

    /**
     *
     * @type {number}
     * @readonly
     */
    this.index = index;

    /**
     *
     * @type {number}
     * @readonly
     */
    this.row = 0;

    /**
     *
     * @type {number}
     * @readonly
     */
    this.column = 0;

    /**
     *
     * @type {number}
     * @readonly
     */
    this.x = 0;

    /**
     *
     * @type {number}
     * @readonly
     */
    this.y = 0;
  }
}

/**
 * Control game field and sync it with board image
 */
export default class FieldRenderer extends Renderer {

  /**
   *
   * @param {BoardRenderer} board
   * @param {number} [rows=15]
   * @param {number} [columns=15]
   */
  constructor(board, rows = 15, columns = 15) {
    super();

    /**
     *
     * @type {BoardRenderer}
     * @readonly
     */
    this.board = board;

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
    this.en = Renderer.createInitialRectsEnteringResult();

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
     *
     * @type {Cell[]}
     * @readonly
     */
    this.cells = new Array(this.rows * this.columns)
      .fill(null)
      .map((value, index) => new Cell(index));

    /**
     *
     * @type {number}
     */
    this.cellSize = 0;

    /**
     * Cell index for highlight
     * @type {number}
     */
    this.highlighted = -1;
  }

  /**
   * Returns cell by specified point position
   * @param {number} x
   * @param {number} y
   * @returns {Cell|undefined}
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
  draw(c, delay) {
    // main board field position and size
    const fx = this.board.x + (this.board.width * this.fieldLeftPadding);
    const fy = this.board.y + (this.board.height * this.fieldMargin * 2);
    const fw = (this.board.width * this.fieldWidth);
    const fh = this.board.height - (this.board.height * (this.fieldMargin * 4));

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
      cell.row = r;
      cell.column = C;
      cell.x = x;
      cell.y = y;

      // if (this.highlighted === i) {
      //   c.fillStyle = 'rgba(255, 255, 255, 0.2)';
      //   c.fillRect(x, y, this.cellSize, this.cellSize);
      // }
    }
  }
}
