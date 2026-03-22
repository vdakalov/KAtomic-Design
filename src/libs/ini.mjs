
export default class Ini {
  /**
   *
   * @param {string} value
   */
  constructor(value) {
    /**
     *
     * @type {string}
     * @readonly
     */
    this.value = value;
    /**
     *
     * @type {Object}
     */
    this.data = {};

    const lines = this.value
      .split(/\r?\n/);

    let group = undefined;
    for (let line of lines) {
      line = line.trim();
      if (line.length === 0) {
        continue;
      }
      if (line.startsWith('[') && line.endsWith(']')) {
        const title = line
          .slice(1, line.length - 1)
          .trim()
          .toLowerCase();
        this.data[title] = group = {};
        continue;
      }
      const eqi = line.indexOf('=');
      if (eqi === -1) {
        continue;
      }
      const left = line.slice(0, eqi).toLowerCase();
      const value = line.slice(eqi + 1, line.length);
      let key = left;
      let tag = '';
      const boi = left.indexOf('[');
      if (boi !== -1) {
        const bci = left.indexOf(']', boi + 1);
        if (bci !== -1) {
          key = left.slice(0, boi);
          tag = left.slice(boi + 1, bci);
        }
      }
      if (key) {
        if (tag) {
          if (group[key] === undefined) {
            group[key] = {};
          } else if (typeof group[key] === 'string') {
            group[key] = {
              '': group[key]
            };
          }
          group[key][tag] = value;
        } else {
          group[key] = value;
        }
      }
    }
  }
}
