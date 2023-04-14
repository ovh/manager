import { policyParamResolve } from '@iam/resolves';
import AbstractCursorDatagridController from '../cursorDatagrid/cursorDatagrid.controller';

export default class PoliciesController extends AbstractCursorDatagridController {
  /* @ngInject */
  constructor($location, ouiDatagridService, IAMRoutes, PolicyService) {
    super($location, ouiDatagridService, 'policiesDatagrid');
    this.IAMRoutes = IAMRoutes;
    this.PolicyService = PolicyService;
  }

  /**
   * Get the list of policies promise
   * @param {string} cursor The current cursor id
   * @returns {Promise}
   */
  createItemsPromise({ cursor }) {
    return this.PolicyService.getPolicies({ cursor });
  }

  /**
   * Go to policy creation
   * @returns {Promise}
   */
  createPolicy() {
    return this.goTo({ name: this.IAMRoutes.CREATE_POLICY });
  }

  /**
   * Go to policy's identities edition
   * @param {string} id The policy id
   * @returns {Promise}
   */
  editIdentities({ id }) {
    return this.goTo({
      name: this.IAMRoutes.POLICY_IDENTITIES,
      params: { policy: id },
    });
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
    return this.goTo({
      name: this.IAMRoutes.DELETE_POLICY,
      params: { ...this.params, [policyParamResolve.key]: id },
    });
  }
}
