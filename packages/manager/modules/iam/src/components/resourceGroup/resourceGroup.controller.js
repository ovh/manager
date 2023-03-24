import { areCursorsEquals, cursorsParamResolve } from '@iam/resolves';
import { ROUTES } from '@iam/routes';

export default class ResourceGroupController {
  /**
   * The cursors resolved object
   * @type {object}
   */
  cursors = null;

  /**
   * The <oui-datagrid> component's id attribute
   * @type {string}
   */
  datagridId = 'resourceGroupDatagrid';

  /* @ngInject */
  constructor($location, ResourceGroupService, ouiDatagridService) {
    this.$location = $location;
    this.ResourceGroupService = ResourceGroupService;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    // Copy the value of the cursors resolve to break the reference
    this.cursors = { ...this[cursorsParamResolve.key] };
  }

  /**
   * Called by uirouter each time a parameter has changed
   * Since the only declared param (cursors) is dynamic, this hook in the only way
   * we can detect that the URL has changed without reloading the entire state
   * @param {Object} params
   */
  uiOnParamsChanged({ [cursorsParamResolve.key]: cursors }) {
    if (cursors && !areCursorsEquals(this.cursors, cursors)) {
      this.cursors = { ...cursors };
      this.ouiDatagridService.refresh(this.datagridId, true);
    }
  }

  /**
   * Change the URL without reloading the state
   * (The cursors param is dynamic)
   * @returns {Promise}
   */
  changeParams() {
    return this.goTo({
      name: '.',
      params: {
        // Pass a copy to break the reference
        [cursorsParamResolve.key]: { ...this.cursors },
      },
    });
  }

  /**
   * Get the list of policies
   * @param {number} offset The <oui-datagrid> component's offset property
   * @param {number} pageSize The <oui-datagrid> component's pageSize property
   * @returns {Promise}
   */
  getResourceGroups({ offset, pageSize }) {
    const total = pageSize + offset;
    const index = Math.floor(total / pageSize);

    return this.ResourceGroupService.getResourceGroups({
      cursor: this.cursors[index],
    })
      .then(({ data, cursor: { next, prev, error } }) => {
        if (error) {
          this.cursors = cursorsParamResolve.declaration.value();
          this.alert.error('iam_resource_group_error_cursor');
          return this.getResourceGroups({ offset: 1, pageSize });
        }

        if (next) this.cursors[index + 1] = next;
        if (prev) this.cursors[index - 1] = prev;
        this.cursors.index = index;

        return this.changeParams().then(() => ({
          data,
          meta: {
            currentOffset: offset,
            totalCount: total - (next ? 0 : 1),
          },
        }));
      })
      .catch((error) => {
        const { message } = error.data ?? {};
        this.alert.error('iam_resource_group_error_data', { message });
        return { data: [], meta: { totalCount: 0 } };
      });
  }

  /**
   * Go to resourceGroup creation
   * @returns {Promise}
   */
  createResourceGroup() {
    this.goTo({
      name: ROUTES.CREATE_RESOURCE_GROUP,
    });
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
      name: ROUTES.DELETE_RESOURCE_GROUP,
      params: { resourceGroup: id },
    });
  }
}
