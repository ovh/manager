import get from 'lodash/get';

export default class PrivateRegistryDeleteCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $window,
    CucControllerHelper,
    privateRegistryService,
  ) {
    this.projectId = $stateParams.projectId;
    this.registryId = $stateParams.registryId;
    this.registryName = $stateParams.registryName;
    this.harborURL = $stateParams.harborURL;
    this.confirmationRequired = $stateParams.confirmationRequired;
    this.fromState = $stateParams.fromState;
    this.$translate = $translate;
    this.$window = $window;
    this.cucControllerHelper = CucControllerHelper;
    this.privateRegistryService = privateRegistryService;
    this.confirmed = false;
    this.registryId = $stateParams.registryId;
  }

  $onInit() {
    if (!this.confirmationRequired) {
      this.getRegistryDetails().then((details) => {
        this.harborURL = details.url;
        this.registryName = details.name;
        return this.confirmRegeneration();
      });
    }
  }

  getRegistryDetails() {
    this.registryDetails = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.privateRegistryService.getRegistry(this.projectId, this.registryId)
        .catch(error => this.goBack(
          this.$translate.instant('private_registry_generate_credentials_error', {
            message: get(error, 'data.message'),
            registryName: this.registryName,
          }), 'error', this.fromState,
        )),
    });
    return this.registryDetails.load();
  }

  confirmRegeneration() {
    this.confirmed = true;
    this.generateCredentials();
  }

  generateCredentials() {
    this.credentials = this.cucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.privateRegistryService.generateCredentials(
        this.projectId,
        this.registryId,
      )
        .then(credentials => credentials)
        .catch(error => this.goBack(
          this.$translate.instant('private_registry_generate_credentials_error', {
            message: get(error, 'data.message'),
            registryName: this.registryName,
          }), 'error', this.fromState,
        )),
    });
    return this.credentials.load();
  }

  goToHarborUI() {
    this.$window.open(this.harborURL, '_blank');
    this.goBack();
  }
}
