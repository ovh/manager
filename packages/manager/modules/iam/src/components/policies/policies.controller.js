import { policyParamResolve } from '../../resolves';
import AbstractCursorDatagridController from '../cursorDatagrid/cursorDatagrid.controller';

export default class PoliciesController extends AbstractCursorDatagridController {
  /* @ngInject */
  constructor(PolicyService) {
    super();
    this.PolicyService = PolicyService;
  }

  /**
   * Get the list of policies promise
   * @param {string} cursor The current cursor id
   * @returns {Promise}
   */
  createItemsPromise({ cursor }) {
    return this.PolicyService.getPolicies({
      cursor,
      ...(!this.advancedMode && { readOnly: false }),
    });
  }

  /**
   * Go to policy creation
   * @returns {Promise}
   */
  createPolicy() {
    return this.goTo({ name: 'iam.createPolicy' });
  }

  /**
   * Go to policy's identities edition
   * @param {string} id The policy id
   * @returns {Promise}
   */
  editIdentities({ id }) {
    return this.goTo({
      name: 'iam.policyIdentities',
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
      name: 'iam.editPolicy',
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
      name: 'iam.policy.policies.deletePolicy',
      params: { ...this.params, [policyParamResolve.key]: id },
    });
  }
}
