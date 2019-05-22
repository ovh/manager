import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($stateParams, $translate, CucControllerHelper, privateRegistryService) {
    this.$translate = $translate;
    this.cucControllerHelper = CucControllerHelper;
    this.privateRegistryService = privateRegistryService;
    this.fromState = $stateParams.fromState;

    this.projectId = $stateParams.projectId;
    this.registry = {};
  }

  createRegistry() {
    this.registry.region = 'GRA7'; // only GRA7 supported as of now
    this.create = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.privateRegistryService.createRegistry(
        this.projectId,
        this.registry,
      )
        .then(res => this.goBack(
          this.$translate.instant('private_registry_onboarding_success', { registryName: this.registry.name }),
          'success',
          this.fromState,
          res.id,
        ))
        .catch(error => this.goBack(
          this.$translate.instant('private_registry_onboarding_error', {
            message: get(error, 'data.message'),
          }),
          'error',
          this.fromState,
        )),
    });
    return this.create.load();
  }

  back() {
    this.goBack(null, null, this.fromState);
  }
}
