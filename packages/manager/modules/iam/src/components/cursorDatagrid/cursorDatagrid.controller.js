import { areCursorsEquals, cursorsParamResolve } from '@iam/resolves';

/**
 * This class is meant to be extended by the datagrid controllers
 * @abstract
 */
export default class AbstractCursorDatagridController {
  /* @ngInject */
  constructor($location, ouiDatagridService, datagridId) {
    this.$location = $location;
    this.ouiDatagridService = ouiDatagridService;

    /**
     * The cursors resolved object
     * @type {object}
     */
    this.cursors = null;

    /**
     * The <oui-datagrid> component's id attribute
     * @type {string}
     */
    this.datagridId = datagridId;
  }

  $onInit() {
    // Copy the value of the cursors resolve to break the reference
    this.cursors = { ...this[cursorsParamResolve.key] };
  }

  /**
   * Called by uirouter each time a parameter has changed
   * Since the only declared param (cursors) is dynamic, this hook in the only way
   * we can detect that the URL has changed without reloading the entire state
   * @param {Object} params
   */
  uiOnParamsChanged({ [cursorsParamResolve.key]: cursors }) {
    if (cursors && !areCursorsEquals(this.cursors, cursors)) {
      this.cursors = { ...cursors };
      this.ouiDatagridService.refresh(this.datagridId, true);
    }
  }

  /**
   * The goTo's params property
   * @returns {Object}
   */
  get params() {
    return {
      // Pass a copy to break the reference
      [cursorsParamResolve.key]: { ...this.cursors },
    };
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
    const total = pageSize + offset;
    const index = Math.floor(total / pageSize);

    return this.createItemsPromise({
      offset,
      pageSize,
      cursor: this.cursors[index],
    })
      .then(({ data, cursor: { next, prev, error } }) => {
        if (error) {
          this.cursors = cursorsParamResolve.declaration.value();
          this.alert.error('iam_cursor_datagrid_error_cursor');
          return this.getItems({ offset: 1, pageSize });
        }

        if (next) this.cursors[index + 1] = next;
        if (prev) this.cursors[index - 1] = prev;
        this.cursors.index = index;

        return this.changeParams().then(() => ({
          data,
          meta: {
            currentOffset: offset,
            totalCount: total - (next ? 0 : 1),
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
