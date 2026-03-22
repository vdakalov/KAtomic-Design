import Drawable from '../drawable.mjs';
import SpriteImageAsset, { map } from '../../assets/images/sprite.mjs';
import DefaultLevelsAsset from '../../assets/levels/default.mjs';

export default class LevelDrawable extends Drawable {
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
        this.level = levels[4];
      });

    /**
     *
     * @type {undefined|Level}
     */
    this.level = undefined;
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
      for (const [fri, fr] of this.level.field.entries()) {
        for (const [fci, fc] of fr.value.split('').entries()) {
          const i = fri * this.application.field.columns + fci;
          const cell = this.application.field.cells[i];
          let x, y, w, h;
          if (fc === '#') {
            [x, y, w, h] = map['#'];
          } else if (map.atom.hasOwnProperty(fc)) {
            [x, y, w, h] = map.atom[fc];
          } else {
            continue;
          }
          this.application.canvas.context
            .drawImage(this.sprite.element, x, y, w, h, cell.x, cell.y, cs, cs);
        }
      }
    }
  }
}
