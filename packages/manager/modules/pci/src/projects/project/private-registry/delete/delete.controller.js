import get from 'lodash/get';
import { DELETE_CONFIRMATION_INPUT } from '../private-registry.constants';

export default class PrivateRegistryDeleteCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    pciPrivateRegistryService,
  ) {
    this.projectId = $stateParams.projectId;
    this.registryId = $stateParams.registryId;
    this.registryName = $stateParams.registryName;
    this.$translate = $translate;
    this.DELETE_CONFIRMATION_INPUT = DELETE_CONFIRMATION_INPUT;
    this.privateRegistryService = pciPrivateRegistryService;
    this.isLoading = false;
  }

  deletePrivateRegistry() {
    this.isLoading = true;
    return this.privateRegistryService.delete(this.projectId, this.registryId)
      .then(() => this.goBack(
        this.$translate.instant('private_registry_delete_success', { registryName: this.registryName }),
      ))
      .catch((error) => this.goBack(
        this.$translate.instant('private_registry_delete_error', {
          message: get(error, 'data.message'),
          registryName: this.registryName,
        }), 'error',
      ));
  }
}
