import Drawable from '../drawable.mjs';
import SpriteImageAsset, { map } from '../../assets/images/sprite.mjs';
import DefaultLevelsAsset from '../../assets/levels/default.mjs';

export class LevelDrawableAtom {

  /**
   *
   * @return {FieldDrawableCell}
   */
  get cell() {
    return this.moves[this.moves.length - 1];
  }

  /**
   *
   * @param {LevelAtom} atom
   * @param {string} char
   * @param {FieldDrawableCell} cell
   */
  constructor(atom, char, cell) {
    /**
     *
     * @type {LevelAtom}
     * @readonly
     */
    this.atom = atom;

    /**
     *
     * @type {string}
     * @readonly
     */
    this.char = char;

    /**
     * Field cell's indexes
     * @type {FieldDrawableCell[]}
     * @readonly
     */
    this.moves = [cell];

    /**
     * Relative distance from previous cell to current (top)
     * @type {number}
     */
    this.transition = 0;
  }

  /**
   *
   * @param {FieldDrawableCell} cell
   * @returns {void}
   */
  move(cell) {
    this.moves.push(cell);
    this.transition = 1;
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
        this.loadLevel(levels[4]);
      });

    /**
     *
     * @type {Level}
     */
    this.level = undefined;

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
      if (this.level.charAtomsMap.hasOwnProperty(char)) {
        const atom = this.level.charAtomsMap[char];
        const cell = this.application.field.cells[index];
        this.atoms[index] = new LevelDrawableAtom(atom, char, cell);
      }
    }
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

      for (const [lci, lc] of this.level.field.entries()) {
        const fc = this.application.field.cells[lci];
        let cx = fc.x;
        let cy = fc.y;
        let x, y, w, h;
        if (lc === '#') {
          [x, y, w, h] = map['#'];
        } else if (map.atom.hasOwnProperty(lc)) {
          [x, y, w, h] = map.atom[lc];
          const cell = this.atoms[lci];
          if (cell.transition > 0) {
            const from = cell.moves[cell.moves.length - 2];
            const to = cell.moves[cell.moves.length - 1];
            // const cellX = to.x - from.x;
            // const cellY = to.y - from.y;
            // const distance = delay * this.application.animationSpeed;
            // const ncx = cellX * distance;
            // const ncy = cellY * distance;
            cx = to.x;
            cy = to.y;
          }
        } else {
          continue;
        }
        c.drawImage(this.sprite.element, x, y, w, h, cx, cy, cs, cs);
      }
    }
  }
}
