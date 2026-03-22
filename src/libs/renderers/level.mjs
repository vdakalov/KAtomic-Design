import { Renderer } from '../render.mjs';
import SpriteImageAsset, { map } from '../../assets/images/sprite.mjs';
import DefaultLevelsAsset from '../../assets/levels/default.mjs';

export default class LevelRenderer extends Renderer {
  /**
   *
   * @param {FieldRenderer} field
   */
  constructor(field) {
    super();

    this.enabled = false;

    /**
     *
     * @type {FieldRenderer}
     * @readonly
     */
    this.field = field;

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
    this.levels = new DefaultLevelsAsset('default');
    this.levels.promise.then(({ levels }) => {
        // set level to render
        this.level = levels[4];
      });

    /**
     *
     * @type {undefined|Level}
     */
    this.level = undefined;
  }

  draw(c, delay) {
    const cs = this.field.cellSize;
    if (this.level !== undefined) {
      for (const [fri, fr] of this.level.field.entries()) {
        for (const [fci, fc] of fr.value.split('').entries()) {
          const i = fri * this.field.columns + fci;
          const cell = this.field.cells[i];
          let x, y, w, h;
          if (fc === '#') {
            [x, y, w, h] = map['#'];
          } else if (map.atom.hasOwnProperty(fc)) {
            [x, y, w, h] = map.atom[fc];
          } else {
            continue;
          }
          c.drawImage(this.sprite.element, x, y, w, h, cell.x, cell.y, cs, cs);
        }
      }
    }
  }
}
