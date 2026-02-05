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

  $onInit() {
    super.$onInit();
    const { identities, resources, actions } = this.getAdvancedSearchParams();
    this.hasActiveAdvancedSearch =
      identities.length > 0 || resources.length > 0 || actions.length > 0;
  }

  /**
   * Get the list of policies promise
   * @param {string} cursor The current cursor id
   * @returns {Promise}
   */
  createItemsPromise({ cursor }) {
    const { identities, resources, actions } = this.getAdvancedSearchParams();
    return this.IAMService.getPolicies({
      cursor,
      readOnly: false,
      identities,
      resources,
      actions,
    });
  }

  /**
   * Helper to format 'advanced search' params obtained from router.
   * @returns {{identities: *[], resources: *[], actions: *[]}}
   */
  getAdvancedSearchParams() {
    let identities = [];
    if (this.identities) {
      identities = [
        ...(this.identities.selection || []),
        ...(this.identities.manual || []),
      ];
    }

    let resources = [];
    if (this.resources) {
      resources = (this.resources.selection || []).map((d) => d.urn);
    }

    let actions = [];
    if (this.actions) {
      actions = [
        ...(this.actions.groups || []).map((d) => d.urn),
        ...(this.actions.selection || []).map((d) => d.action),
      ];
    }

    return { identities, resources, actions };
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

  resetAdvancedSearch() {
    this.trackClick(MY_POLICIES_TRACKING_HITS.RESET_SEARCH);
    return this.goTo({
      name: 'iam.policies.myPolicies',
      params: {
        ...this.params,
        identities: null,
        resources: null,
        actions: null,
      },
    });
  }

  openAdvancedSearchModal() {
    this.trackClick(MY_POLICIES_TRACKING_HITS.ADVANCED_SEARCH);
    return this.goTo({
      name: 'iam.policies.myPolicies.advancedSearch',
    });
  }
}
