import Drawable from '../drawable.mjs';
import { CellCharMap, AtomCharNameMap } from '../levels.mjs';
import SpriteImageAsset, { map } from '../../assets/images/sprite.mjs';
import DefaultLevelsAsset from '../../assets/levels/default.mjs';

/**
 *
 * @enum {number}
 * @readonly
 */
export const Direction = {
  Up: 0,
  Left: 1,
  Right: 2,
  Down: 3,
};

export class LevelDrawableCell {

  /**
   *
   * @returns {boolean}
   */
  get isEmpty() {
    return this.char === CellCharMap.Empty;
  }

  /**
   *
   * @returns {boolean}
   */
  get isBlock() {
    return this.char === CellCharMap.Block;
  }

  /**
   *
   * @returns {boolean}
   */
  get isAtom() {
    return AtomCharNameMap.hasOwnProperty(this.char);
  }

  /**
   *
   * @param {string} char
   * @param {FieldDrawableCell} fc
   */
  constructor(char, fc) {

    /**
     *
     * @type {string}
     * @readonly
     */
    this.char = char;

    /**
     *
     * @type {FieldDrawableCell}
     * @readonly
     */
    this.fc = fc;
  }
}

export class LevelDrawableAtom {

  /**
   *
   * @return {FieldDrawableCell}
   */
  get fc() {
    return this.moves[this.moves.length - 1];
  }

  /**
   *
   * @return {boolean}
   */
  get isAnimationPlaying() {
    return this.transition > 0;
  }

  /**
   *
   * @param {LevelAtom} atom
   * @param {FieldDrawableCell} fc
   */
  constructor(atom, fc) {
    /**
     *
     * @type {LevelAtom}
     * @readonly
     */
    this.atom = atom;

    /**
     * Field cell's indexes
     * @type {FieldDrawableCell[]}
     * @readonly
     */
    this.moves = [fc];

    /**
     * Relative distance from previous cell to current (top)
     * @type {number}
     */
    this.transition = 0;
  }

  /**
   *
   * @param {number} delay Time since previous request for animation
   * @param {number} speed Px in second
   * @returns {[x: number, y: number]}
   */
  getAnimatedPosition(delay, speed) {
    if (this.transition > 0 && this.moves.length > 1) {
      const { x: x1, y: y1 } = this.moves[this.moves.length - 2];
      const { x: x2, y: y2 } = this.moves[this.moves.length - 1];
      const seconds = delay / 1e3;
      const distance = Math.hypot(x2 - x1, y2 - y1);
      const step = speed * seconds;
      const progress = Math.min(1, step / distance);
      const transition = Math.max(0, this.transition - progress);
      const completed = 1 - transition;
      const dx = x1 + ((x2 - x1) * completed);
      const dy = y1 + ((y2 - y1) * completed);

      console.log({
        delay, 'this.transition': this.transition, transition,
        seconds, distance, step, progress,
        x1, y1, x2, y2, dx, dy,
      });

      this.transition = transition;

      return [dx, dy];
    }
    return [this.fc.x, this.fc.y];
  }

  /**
   *
   * @param {number} delay delay from previous animation frame, to current in milliseconds
   * @param {number} duration How long animation should play in seconds
   * @returns {[x: number, y: number]}
   */
  getAnimatedPosition2(delay, duration) {
    if (this.transition > 0 && this.moves.length > 1) {
      const { x: x1, y: y1 } = this.moves[this.moves.length - 2];
      const { x: x2, y: y2 } = this.moves[this.moves.length - 1];
      const progress = Math.min(1, delay / (duration * 1e3));
      const transition = Math.max(0, this.transition - progress);
      const completed = 1 - transition;
      const dx = x1 + ((x2 - x1) * completed);
      const dy = y1 + ((y2 - y1) * completed);

      this.transition = transition;

      return [dx, dy];
    }
    return [this.fc.x, this.fc.y];
  }
}

export default class LevelsDrawable extends Drawable {
  /**
   *
   * @param {Application} application
   */
  constructor(application) {
    super(application, false);

    /**
     *
     * @type {SpriteImageAsset}
     * @readonly
     */
    this.sprite = new SpriteImageAsset();
    this.sprite.promise.then(() => this.enabled = true);

    /**
     *
     * @type {DefaultLevelsAsset}
     * @readonly
     */
    this.asset = new DefaultLevelsAsset('default');
    this.asset.promise.then(({ levels }) => {
        // set level to render
        this.loadLevel(levels.find(l => l.number === 12));
      });

    /**
     *
     * @type {Level}
     */
    this.level = undefined;

    /**
     *
     * @type {LevelDrawableCell[]}
     * @readonly
     */
    this.cells = [];

    /**
     * Drawable atoms
     * @type {(LevelDrawableAtom|void)[]}
     */
    this.atoms = [];
  }

  /**
   *
   * @param {Level} level
   */
  loadLevel(level) {
    this.level = level;
    this.atoms.length = 0;

    for (const [index, char] of Object.entries(this.level.field)) {
      const fc = this.application.field.cells[index];
      const lc = new LevelDrawableCell(char, fc);
      this.cells.push(lc);
      if (this.level.charAtomsMap.hasOwnProperty(char)) {
        const atom = this.level.charAtomsMap[char];
        this.atoms[index] = new LevelDrawableAtom(atom, fc);
      }
    }
  }

  /**
   *
   * @param {FieldDrawableCell} fc
   * @returns {boolean}
   */
  isAbleToMove(fc) {
    return this.atoms[fc.index] === undefined &&
      !this.cells[fc.index].isBlock;
  }

  /**
   *
   * @param {LevelDrawableAtom} atom
   * @param {Direction} [direction=Direction.Up]
   */
  moveAtom(atom, direction) {
    let tfc = atom.fc;
    switch (direction) {
      case Direction.Up:
        while (tfc.up !== undefined && this.isAbleToMove(tfc.up)) {
          tfc = tfc.up;
        }
        break;
      case Direction.Left:
        while (tfc.left !== undefined && this.isAbleToMove(tfc.left)) {
          tfc = tfc.left;
        }
        break;
      case Direction.Right:
        while (tfc.right !== undefined && this.isAbleToMove(tfc.right)) {
          tfc = tfc.right;
        }
        break;
      case Direction.Down:
        while (tfc.down !== undefined && this.isAbleToMove(tfc.down)) {
          tfc = tfc.down;
        }
        break;
    }
    this.atoms[atom.fc.index] = undefined;
    this.atoms[tfc.index] = atom;
    atom.moves.push(tfc);
    atom.transition = 1;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {number} delay
   * @returns {void}
   */
  _draw(c, delay) {
    const cs = this.application.field.cellSize;
    if (this.level !== undefined) {
      c.fillStyle = 'red';
      c.font = '26px monospace';
      c.fillText(`Level: ${this.level.getName()}`,
        this.application.board.x + 24,
        this.application.board.y + 28);

      for (const lc of this.cells) {
        if (lc.isBlock) {
          const [x, y, w, h] = map[CellCharMap.Block];
          c.drawImage(this.sprite.element, x, y, w, h, lc.fc.x, lc.fc.y, cs, cs);
        }
      }

      for (const la of this.atoms) {
        if (la !== undefined) {
          const [fx, fy] = la.getAnimatedPosition2(delay, this.application.animationDuration);
          const [x, y, w, h] = map.atom[la.atom.char];
          c.drawImage(this.sprite.element, x, y, w, h, fx, fy, cs, cs);
        }
      }
    }
  }
}
