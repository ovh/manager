import AbstractCursorDatagridController from '../../components/cursorDatagrid/cursorDatagrid.controller';

export default class PoliciesController extends AbstractCursorDatagridController {
  /* @ngInject */
  constructor(IAMService) {
    super();
    this.IAMService = IAMService;
  }

  /**
   * Get the list of policies promise
   * @param {string} cursor The current cursor id
   * @returns {Promise}
   */
  createItemsPromise({ cursor }) {
    return this.IAMService.getPolicies({
      cursor,
      ...(!this.advancedMode && { readOnly: false }),
    });
  }

  /**
   * Go to policy creation
   * @returns {Promise}
   */
  createPolicy() {
    return this.goTo({ name: 'iam.policy.create' });
  }

  /**
   * Go to policy's identities edition
   * @param {string} id The policy id
   * @returns {Promise}
   */
  editIdentities({ id }) {
    return this.goTo({
      name: 'iam.identities',
      params: { policy: id },
    });
  }

  /**
   * Go to policy edition
   * @param {string} id The policy id
   * @returns {Promise}
   */
  editPolicy({ id }) {
    return this.goTo({
      name: 'iam.policy.edit',
      params: { policy: id },
    });
  }

  /**
   * Go to policy deletion
   * @param {string} id The policy id
   * @returns {Promise}
   */
  deletePolicy({ id }) {
    return this.goTo({
      name: 'iam.dashboard.policies.delete',
      params: { ...this.params, policy: id },
    });
  }
}
