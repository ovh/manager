import { AbstractCursorDatagridController } from '@ovh-ux/manager-ng-apiv2-helper';
import { PAGE_SIZE, TAG } from '../../iam.constants';

export default class PoliciesController extends AbstractCursorDatagridController {
  /* @ngInject */
  constructor(IAMService) {
    super();
    this.IAMService = IAMService;
    this.pageSize = PAGE_SIZE;
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
    this.trackClick(TAG.POLICIES__ADD);
    return this.goTo({ name: 'iam.policy.create' });
  }

  /**
   * Go to policy edition
   * @param {string} id The policy id
   * @returns {Promise}
   */
  editPolicy({ id }) {
    this.trackClick(TAG.POLICIES__EDIT);
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
    this.trackClick(TAG.POLICIES__DELETE);
    return this.goTo({
      name: 'iam.dashboard.policies.delete',
      params: { ...this.params, policy: id },
    });
  }
}
