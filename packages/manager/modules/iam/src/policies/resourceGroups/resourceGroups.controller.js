import { AbstractCursorDatagridController } from '@ovh-ux/manager-ng-apiv2-helper';
import { PAGE_SIZE, TAG } from '../../iam.constants';

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
    this.trackClick(TAG.RESOURCE_GROUPS__ADD);
    return this.goTo({ name: 'iam.resourceGroup.create' });
  }

  /**
   * Go to resourceGroup edition
   * @param {string} id The resourceGroup id
   * @returns {Promise}
   */
  editResourceGroup({ id }) {
    this.trackClick(TAG.RESOURCE_GROUPS__EDIT);
    return this.goTo({
      name: 'iam.resourceGroup.edit',
      params: { resourceGroup: id },
    });
  }

  /**
   * Go to resourceGroup deletion
   * @param {string} id The resourceGroup id
   * @returns {Promise}
   */
  deleteResourceGroup({ id }) {
    this.trackClick(TAG.RESOURCE_GROUPS__DELETE);
    this.goTo({
      name: 'iam.policies.resourceGroups.delete',
      params: { resourceGroup: id },
    });
  }
}
