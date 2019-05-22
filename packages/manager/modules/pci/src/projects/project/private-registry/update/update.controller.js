import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    CucControllerHelper,
    privateRegistryService,
  ) {
    this.projectId = $stateParams.projectId;
    this.registryId = $stateParams.registryId;
    this.registryName = $stateParams.registryName;
    this.$translate = $translate;
    this.cucControllerHelper = CucControllerHelper;
    this.privateRegistryService = privateRegistryService;
  }

  $onInit() {
    this.newRegistryName = this.registryName;
  }

  updateRegistry() {
    if (this.newRegistryName === this.registryName) {
      return this.goBack();
    }
    this.update = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.privateRegistryService.updateRegistry(
        this.projectId,
        this.registryId,
        this.newRegistryName,
      )
        .then(() => this.goBack(
          this.$translate.instant('private_registry_update_success', { newRegistryName: this.newRegistryName }),
        ))
        .catch(error => this.goBack(
          this.$translate.instant('private_registry_update_error', {
            message: get(error, 'data.message'),
            registryName: this.registryName,
          }), 'error',
        )),
    });
    return this.update.load();
  }
}
