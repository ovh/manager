import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, pciPrivateRegistryService) {
    this.$translate = $translate;
    this.privateRegistryService = pciPrivateRegistryService;
    this.loading = false;
    this.registry = {};
  }

  create() {
    this.loading = true;
    return this.privateRegistryService
      .create(this.projectId, this.registry)
      .then((res) =>
        this.goBack(
          this.$translate.instant('private_registry_onboarding_success', {
            registryName: this.registry.name,
          }),
          'success',
          res.id,
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('private_registry_onboarding_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  getAvailablePlans() {
    this.registry.region = this.registry.region.name;
    this.availablePlans = this.plans(this.registry.region);
  }

  changeMethod(value) {
    this.registry.planID = value.id;
  }
}
