import { AbstractCursorDatagridController } from '@ovh-ux/manager-ng-apiv2-helper';
import { PAGE_SIZE } from '../../iam.constants';
import { OVH_POLICIES_TRACKING_HITS } from './ovhPolicies.constants';

export default class OvhPoliciesController extends AbstractCursorDatagridController {
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
      readOnly: true,
    });
  }

  /**
   * Go to policy edition
   * @param {string} id The policy id
   * @returns {Promise}
   */
  editPolicy({ id }) {
    this.trackClick(OVH_POLICIES_TRACKING_HITS.EDIT_POLICY);
    return this.goTo({
      name: 'iam.policies.ovhPolicies.edit',
      params: { policy: id },
    });
  }
}
