import Canvas from './libs/canvas.mjs';
import Raf from './libs/raf.mjs';
import Scene from './libs/scene.mjs';
import BoardDrawable from './libs/drawables/board.mjs';
import FieldDrawable from './libs/drawables/field.mjs';
import LevelDrawable from './libs/drawables/level.mjs';

export default class Application {
  constructor() {

    /**
     *
     * @type {Canvas}
     * @readonly
     */
    this.canvas = new Canvas(this);

    /**
     *
     * @type {Raf}
     * @readonly
     */
    this.raf = new Raf();

    /**
     *
     * @type {Scene}
     * @readonly
     */
    this.scene = new Scene(this);

    /**
     *
     * @type {BoardDrawable}
     * @readonly
     */
    this.board = new BoardDrawable(this);

    /**
     *
     * @type {FieldDrawable}
     * @readonly
     */
    this.field = new FieldDrawable(this);

    /**
     *
     * @type {LevelDrawable}
     * @readonly
     */
    this.level = new LevelDrawable(this);

    // start raf
    this.raf.resume();

    // listen for canvas events
    this.canvas.element.addEventListener('mousemove', this.onCanvasMouseMove.bind(this));
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
