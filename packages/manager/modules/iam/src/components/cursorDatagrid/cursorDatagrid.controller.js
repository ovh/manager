import { PAGE_SIZE } from '../../iam.constants';
import { areCursorsEquals, cursorsParamResolve } from '../../resolves';

/**
 * This class is meant to be extended by the datagrid controllers
 * @abstract
 */
export default class AbstractCursorDatagridController {
  constructor() {
    /**
     * The cursors resolved object
     * @type {object}
     */
    this.cursors = null;

    this.PAGE_SIZE = PAGE_SIZE;
  }

  $onInit() {
    // Copy the value of the cursors resolve to break the reference
    const cursorsParam = this[cursorsParamResolve.key];
    this.cursors = cursorsParam ? { ...cursorsParam } : null;
  }

  /**
   * Called by uirouter each time a parameter has changed
   * Since the only declared param (cursors) is dynamic, this hook in the only way
   * we can detect that the URL has changed without reloading the entire state
   * @param {Object} params
   */
  uiOnParamsChanged({ [cursorsParamResolve.key]: cursors }) {
    if (!areCursorsEquals(this.cursors, cursors)) {
      if (cursors?.index >= 2) {
        this.cursors = { ...cursors };
      } else {
        this.cursors.index = 1;
      }
    }
  }

  /**
   * The goTo's params property
   * @returns {Object}
   */
  get params() {
    return this.cursors?.index >= 2
      ? {
          // Pass a copy to break the reference
          [cursorsParamResolve.key]: { ...this.cursors },
        }
      : {};
  }

  /**
   * Change the URL without reloading the state
   * (The cursors param is dynamic)
   * @returns {Promise}
   */
  changeParams() {
    return this.goTo({ name: '.', params: this.params });
  }

  /**
   * Get the list of items
   * @param {number} offset The <oui-datagrid> component's offset property
   * @param {number} pageSize The <oui-datagrid> component's pageSize property
   * @returns {Promise}
   */
  getItems({ offset, pageSize }) {
    const total = pageSize + offset - 1;
    const index = Math.floor(total / pageSize);

    return this.createItemsPromise({
      offset,
      pageSize,
      cursor: this.cursors?.[index],
    })
      .then(({ data, cursor: { next, prev, error } }) => {
        if (error) {
          this.cursors = null;
          this.alert.error('iam_cursor_datagrid_error_cursor');
          return this.changeParams().then(() =>
            this.getItems({ offset: 1, pageSize }),
          );
        }

        if (!this.cursors) this.cursors = {};
        if (next) this.cursors[index + 1] = next;
        if (prev) this.cursors[index - 1] = prev;
        this.cursors.index = index;

        return this.changeParams().then(() => ({
          data,
          meta: {
            currentOffset: offset,
            totalCount: total + (next ? 1 : 0),
          },
        }));
      })
      .catch((error) => {
        const { message } = error.data ?? {};
        this.alert.error('iam_cursor_datagrid_error_data', { message });
        return { data: [], meta: { totalCount: 0 } };
      });
  }

  /**
   * Create the items promise
   * @abstract
   * @returns {Promise}
   */
  createItemsPromise() { // eslint-disable-line
    throw new Error(
      'CursorDatagridController#createItemsPromise must be overriden',
    );
  }
}
