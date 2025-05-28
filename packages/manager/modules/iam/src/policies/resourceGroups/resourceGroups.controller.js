import { AbstractCursorDatagridController } from '@ovh-ux/manager-ng-apiv2-helper';
import { PAGE_SIZE } from '../../iam.constants';
import { RESOURCE_GROUPS_TRACKING_HITS } from './resourceGroups.constants';

export default class ResourceGroupsController extends AbstractCursorDatagridController {
  /* @ngInject */
  constructor(IAMService) {
    super();
    this.IAMService = IAMService;
    this.pageSize = PAGE_SIZE;
  }

  /**
   * Get the list of resource groups promise
   * @param {string} cursor The current cursor id
   * @returns {Promise}
   */
  createItemsPromise({ cursor }) {
    return this.IAMService.getResourceGroups({ cursor });
  }

  /**
   * Go to resourceGroup creation
   * @returns {Promise}
   */
  createResourceGroup() {
    this.trackClick(RESOURCE_GROUPS_TRACKING_HITS.ADD_RESOURCE_GROUP);
    return this.goTo({ name: 'iam.policies.resourceGroups.create' });
  }

  /**
   * Go to resourceGroup edition
   * @param {string} id The resourceGroup id
   * @returns {Promise}
   */
  editResourceGroup({ id }) {
    this.trackClick(RESOURCE_GROUPS_TRACKING_HITS.UPDATE_RESOURCE_GROUP);
    return this.goTo({
      name: 'iam.policies.resourceGroups.edit',
      params: { resourceGroup: id },
    });
  }

  /**
   * Go to resourceGroup deletion
   * @param {string} id The resourceGroup id
   * @returns {Promise}
   */
  deleteResourceGroup({ id }) {
    this.trackClick(RESOURCE_GROUPS_TRACKING_HITS.DELETE_RESOURCE_GROUP);
    this.goTo({
      name: 'iam.policies.resourceGroups.delete',
      params: { resourceGroup: id },
    });
  }
}
