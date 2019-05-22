import get from 'lodash/get';

export default class PrivateRegistryDeleteCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    CucControllerHelper,
    privateRegistryService,
    DELETE_CONFIRMATION_INPUT,
  ) {
    this.projectId = $stateParams.projectId;
    this.registryId = $stateParams.registryId;
    this.registryName = $stateParams.registryName;
    this.$translate = $translate;
    this.cucControllerHelper = CucControllerHelper;
    this.DELETE_CONFIRMATION_INPUT = DELETE_CONFIRMATION_INPUT;
    this.privateRegistryService = privateRegistryService;
  }

  deletePrivateRegistry() {
    this.delete = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.privateRegistryService.deleteRegistry(
        this.projectId,
        this.registryId,
      )
        .then(() => this.goBack(
          this.$translate.instant('private_registry_delete_success', { registryName: this.registryName }),
        ))
        .catch(error => this.goBack(
          this.$translate.instant('private_registry_delete_error', {
            message: get(error, 'data.message'),
            registryName: this.registryName,
          }), 'error',
        )),
    });
    return this.delete.load();
  }
}
