import Canvas from './libs/canvas.mjs';
import Raf from './libs/raf.mjs';
import Scene from './libs/scene.mjs';
import BoardDrawable from './libs/drawables/board.mjs';
import FieldDrawable from './libs/drawables/field.mjs';
import LevelsDrawable from './libs/drawables/levels.mjs';
import ControlDrawable from './libs/drawables/control.mjs';

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
     * @type {LevelsDrawable}
     * @readonly
     */
    this.levels = new LevelsDrawable(this);

    /**
     *
     * @type {ControlDrawable}
     * @readonly
     */
    this.control = new ControlDrawable(this);

    /**
     *
     * @type {number}
     */
    this.animationSpeed = 500;

    /**
     * How long animation should play in seconds
     * @type {number}
     * @readonly
     */
    this.animationDuration = 0.5;

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
