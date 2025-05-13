import { isEqual } from 'lodash-es';

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
  }

  $onInit() {
    this.PAGE_SIZE = this.pageSize;
    // Copy the value of the cursors resolve to break the reference
    const cursorsParam = this.cursors;
    this.cursors = cursorsParam ? { ...cursorsParam } : null;
  }

  /**
   * Called by uirouter each time a parameter has changed
   * Since the only declared param (cursors) is dynamic, this hook in the only way
   * we can detect that the URL has changed without reloading the entire state
   * @param {Object} params
   */
  uiOnParamsChanged({ cursors }) {
    if (
      !AbstractCursorDatagridController.areCursorsEquals(this.cursors, cursors)
    ) {
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
          cursors: { ...this.cursors },
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
          return this.reloadItems(pageSize);
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
        if (error.cursor?.error) {
          // if error occurs on cursor, first page is reloaded
          return this.reloadItems(pageSize);
        }
        const message = error.data?.message;
        this.alert.error('cursor_datagrid_error_data', { message });
        return { data: [], meta: { totalCount: 0 } };
      });
  }

  reloadItems(pageSize) {
    return this.changeParams().then(() =>
      this.getItems({ offset: 1, pageSize }),
    );
  }

  /**
   * Create the items promise
   * @abstract
   * @returns {Promise}
   */
  // eslint-disable-next-line class-methods-use-this
  createItemsPromise() {
    // eslint-disable-line
    throw new Error(
      'CursorDatagridController#createItemsPromise must be overriden',
    );
  }

  static areCursorsEquals(cursorsA, cursorsB) {
    return cursorsA === cursorsB || isEqual(cursorsA, cursorsB);
  }
}
