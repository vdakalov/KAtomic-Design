import Drawable from '../drawable.mjs';
import { Direction } from './levels.mjs';
import { map } from '../../assets/images/sprite.mjs';

export default class ControlDrawable extends Drawable {

  /**
   *
   * @param {Application} application
   */
  constructor(application) {
    super(application);

    /**
     *
     * @type {LevelDrawableAtom|undefined}
     * @private
     */
    this.selected = undefined;

    /**
     *
     * @type {boolean}
     * @private
     */
    this.shown = true;

    this.application.canvas.element.addEventListener('click', this.onClick.bind(this));
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {void}
   */
  onClick(event) {
    // no level loaded
    if (this.application.levels.level === undefined) {
      return;
    }

    // previous (before this click) active atom
    const aa = this.selected;
    this.selected = undefined;

    // active (under click) field cell
    const afc = this.application.field.getCellByPoint(event.offsetX, event.offsetY);

    // click out of game field (no any cell)
    if (afc === undefined) {
      return;
    }

    const atom = this.application.levels.atoms[afc.index];

    // define atom cell as selected
    if (atom !== undefined) {
      this.selected = atom;
      return;
    }

    // define move action if animation is not playing now
    if (aa !== undefined && !aa.isAnimationPlaying) {
      // target field cell to move
      let dir = undefined;
      switch (afc) {
        case aa.fc.up: dir = Direction.Up; break;
        case aa.fc.left: dir = Direction.Left; break;
        case aa.fc.right: dir = Direction.Right; break;
        case aa.fc.down: dir = Direction.Down; break;
      }
      this.application.levels.moveAtom(aa, dir);
      this.selected = aa;
      this.shown = false;
    }
  }

  _draw(c, delay) {
    if (this.selected !== undefined) {
      // active atom
      const aa = this.selected;
      if (this.shown) {
        const cs = this.application.field.cellSize;
        // c.fillStyle = 'rgba(255, 255, 255, 0.4)';
        // c.fillRect(fc.x, fc.y, cs, cs);

        if (this.application.levels.sprite.isLoaded) {
          if (aa.fc.up !== undefined && this.application.levels.isAbleToMove(aa.fc.up)) {
            const [x, y, w, h] = map.arrow['u'];
            c.drawImage(this.application.levels.sprite.element,
              x, y, w, h, aa.fc.up.x, aa.fc.up.y, cs, cs);
          }
          if (aa.fc.left !== undefined && this.application.levels.isAbleToMove(aa.fc.left)) {
            const [x, y, w, h] = map.arrow['l'];
            c.drawImage(this.application.levels.sprite.element,
              x, y, w, h, aa.fc.left.x,  aa.fc.left.y, cs, cs);
          }
          if (aa.fc.right !== undefined && this.application.levels.isAbleToMove(aa.fc.right)) {
            const [x, y, w, h] = map.arrow['r'];
            c.drawImage(this.application.levels.sprite.element,
              x, y, w, h, aa.fc.right.x,  aa.fc.right.y, cs, cs);
          }
          if (aa.fc.down !== undefined && this.application.levels.isAbleToMove(aa.fc.down)) {
            const [x, y, w, h] = map.arrow['d'];
            c.drawImage(this.application.levels.sprite.element,
              x, y, w, h, aa.fc.down.x,  aa.fc.down.y, cs, cs);
          }
        }
      } else if (!aa.isAnimationPlaying) {
        this.shown = true;
      }
    }
  }
}
