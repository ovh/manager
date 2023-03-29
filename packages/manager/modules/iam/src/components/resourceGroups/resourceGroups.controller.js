import AbstractCursorDatagridController from '../cursorDatagrid/cursorDatagrid.controller';

export default class ResourceGroupsController extends AbstractCursorDatagridController {
  /* @ngInject */
  constructor($location, IAMRoutes, ResourceGroupService, ouiDatagridService) {
    super($location, ouiDatagridService, 'resourceGroupDatagrid');
    this.IAMRoutes = IAMRoutes;
    this.ResourceGroupService = ResourceGroupService;
  }

  /**
   * Get the list of resource groups promise
   * @param {string} cursor The current cursor id
   * @returns {Promise}
   */
  createItemsPromise({ cursor }) {
    return this.ResourceGroupService.getResourceGroups({ cursor });
  }

  /**
   * Go to resourceGroup creation
   * @returns {Promise}
   */
  createResourceGroup() {
    this.alert.error('createResourceGroup not implemented');
  }

  /**
   * Go to resourceGroup edition
   * @param {string} id The resourceGroup id
   * @returns {Promise}
   */
  editResourceGroup({ id }) {
    this.alert.error(`editResourceGroup not implemented [id=${id}]`);
  }

  /**
   * Go to resourceGroup deletion
   * @param {string} id The resourceGroup id
   * @returns {Promise}
   */
  deleteResourceGroup({ id }) {
    this.goTo({
      name: this.IAMRoutes.DELETE_RESOURCE_GROUP,
      params: { resourceGroup: id },
    });
  }
}
