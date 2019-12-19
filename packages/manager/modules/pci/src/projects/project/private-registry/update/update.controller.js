import get from 'lodash/get';

export default class {
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
    this.privateRegistryService = pciPrivateRegistryService;
    this.isLoading = false;
  }

  $onInit() {
    this.newRegistryName = this.registryName;
  }

  update() {
    if (this.newRegistryName === this.registryName) {
      return this.goBack();
    }
    this.isLoading = true;
    return this.privateRegistryService.update(
      this.projectId,
      this.registryId,
      this.newRegistryName,
    )
      .then(() => this.goBack(
        this.$translate.instant('private_registry_update_success', { newRegistryName: this.newRegistryName }),
      ))
      .catch((error) => this.goBack(
        this.$translate.instant('private_registry_update_error', {
          message: get(error, 'data.message'),
          registryName: this.registryName,
        }), 'error',
      ));
  }
}
