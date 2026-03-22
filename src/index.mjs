import Canvas from './libs/canvas.mjs';
import Raf from './libs/raf.mjs';
import Render from './libs/render.mjs';
import BoardRenderer from './libs/renderers/board.mjs';
import FieldRenderer from './libs/renderers/field.mjs';
import LevelRenderer from './libs/renderers/level.mjs';
import DefaultLevelsAsset from './assets/levels/default.mjs';
import SpriteImageAsset from './assets/images/sprite.mjs';

export default class Application {
  constructor() {

    /**
     *
     * @type {Canvas}
     * @readonly
     */
    this.canvas = new Canvas();

    /**
     *
     * @type {Raf}
     * @readonly
     */
    this.raf = new Raf();

    /**
     *
     * @type {Render}
     * @readonly
     */
    this.render = new Render();

    /**
     *
     * @type {BoardRenderer}
     * @readonly
     */
    this.board = new BoardRenderer();

    /**
     *
     * @type {FieldRenderer}
     * @readonly
     */
    this.field = new FieldRenderer(this.board);

    /**
     *
     * @type {LevelRenderer}
     * @readonly
     */
    this.level = new LevelRenderer(this.field);

    // register board renderer
    this.render.push(
      this.board,
      this.field,
      this.level);

    // register raf handler
    this.raf.push(this.update.bind(this));
    // start raf
    this.raf.resume();

    // listen for canvas events
    this.canvas.element.addEventListener('mousemove', this.onCanvasMouseMove.bind(this));
  }

  /**
   *
   * @param {number} delay
   * @returns {void}
   * @private
   */
  update(delay) {
    this.canvas.adjustSize();
    this.render.draw(this.canvas.context, delay);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  onCanvasMouseMove(event) {
    const cell = this.field.getCellByPoint(event.offsetX, event.offsetY);
    this.field.highlighted = cell === undefined ? -1 : cell.index;
  }
}
