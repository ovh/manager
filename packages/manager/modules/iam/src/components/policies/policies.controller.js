import { areCursorsEquals, cursorsParamResolve } from '@iam/resolves';

export default class PoliciesController {
  /**
   * The cursors resolved object
   * @type {object}
   */
  cursors = null;

  /**
   * The <oui-datagrid> component's id attribute
   * @type {string}
   */
  datagridId = 'policiesDatagrid';

  /* @ngInject */
  constructor($location, PolicyService, ouiDatagridService) {
    this.$location = $location;
    this.PolicyService = PolicyService;
    this.ouiDatagridService = ouiDatagridService;
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
    if (!areCursorsEquals(this.cursors, cursors)) {
      this.cursors = { ...cursors };
      this.ouiDatagridService.refresh(this.datagridId, true);
    }
  }

  /**
   * Change the URL without reloading the state
   * (The cursors param is dynamic)
   * @returns {Promise}
   */
  changeParams() {
    return this.goTo({
      name: '.',
      params: {
        // Pass a copy to break the reference
        [cursorsParamResolve.key]: { ...this.cursors },
      },
    });
  }

  /**
   * Get the list of policies
   * @param {number} offset The <oui-datagrid> component's offset property
   * @param {number} pageSize The <oui-datagrid> component's pageSize property
   * @returns {Promise}
   */
  getPolicies({ offset, pageSize }) {
    const total = pageSize + offset;
    const index = Math.floor(total / pageSize);

    return this.PolicyService.getPolicies({ cursor: this.cursors[index] })
      .then(({ data, cursor: { next, prev, error } }) => {
        if (error) {
          this.cursors = cursorsParamResolve.declaration.value();
          this.alert.error('iam_policy_error_cursor');
          return this.getPolicies({ offset: 1, pageSize });
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
        this.alert.apiError('iam_policy_error_data', error);
        return { data: [], meta: { totalCount: 0 } };
      });
  }

  /**
   * Go to policy creation
   * @returns {Promise}
   */
  createPolicy() {
    this.alert.error('createPolicy not implemented');
  }

  /**
   * Go to policy's identities edition
   * @param {string} id The policy id
   * @returns {Promise}
   */
  editIdentities({ id }) {
    this.alert.error(`editIdentities not implemented [id=${id}]`);
  }

  /**
   * Go to policy edition
   * @param {string} id The policy id
   * @returns {Promise}
   */
  editPolicy({ id }) {
    this.alert.error(`editPolicy not implemented [id=${id}]`);
  }

  /**
   * Go to policy deletion
   * @param {string} id The policy id
   * @returns {Promise}
   */
  deletePolicy({ id }) {
    this.alert.error(`deletePolicy not implemented [id=${id}]`);
  }
}
