import { AbstractCursorDatagridController } from '@ovh-ux/manager-ng-apiv2-helper';
import { PAGE_SIZE } from '../../iam.constants';
import { MY_POLICIES_TRACKING_HITS } from './myPolicies.constants';

export default class MyPoliciesController extends AbstractCursorDatagridController {
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
      readOnly: false,
    });
  }

  /**
   * Go to policy creation
   * @returns {Promise}
   */
  createPolicy() {
    this.trackClick(MY_POLICIES_TRACKING_HITS.CREATE_POLICY);
    return this.goTo({ name: 'iam.policies.myPolicies.create' });
  }

  /**
   * Go to policy edition
   * @param {string} id The policy id
   * @returns {Promise}
   */
  editPolicy({ id }) {
    this.trackClick(MY_POLICIES_TRACKING_HITS.EDIT_POLICY);
    return this.goTo({
      name: 'iam.policies.myPolicies.edit',
      params: { policy: id },
    });
  }

  /**
   * Go to policy deletion
   * @param {string} id The policy id
   * @returns {Promise}
   */
  deletePolicy({ id }) {
    this.trackClick(MY_POLICIES_TRACKING_HITS.DELETE_POLICY);
    return this.goTo({
      name: 'iam.policies.myPolicies.delete',
      params: { ...this.params, policy: id },
    });
  }

  openAdvancedSearchModal() {
    // TODO: tracking + translation
    return this.goTo({
      name: 'iam.policies.myPolicies.advancedSearch',
    });
  }
}
