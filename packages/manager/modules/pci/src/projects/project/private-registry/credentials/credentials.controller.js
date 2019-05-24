import get from 'lodash/get';

export default class PrivateRegistryDeleteCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $window,
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
    this.privateRegistryService = privateRegistryService;
    this.confirmed = false;
    this.registryId = $stateParams.registryId;
    this.isLoading = false;
  }

  $onInit() {
    if (!this.confirmationRequired) {
      this.getRegistryDetails()
        .then(() => this.confirmRegeneration());
    }
  }

  getRegistryDetails() {
    this.isLoading = true;
    return this.privateRegistryService.getRegistry(this.projectId, this.registryId)
      .then((details) => {
        this.harborURL = details.url;
        this.registryName = details.name;
        this.isLoading = false;
      })
      .catch(error => this.goBack(
        this.$translate.instant('private_registry_generate_credentials_error', {
          message: get(error, 'data.message'),
          registryName: this.registryName,
        }), 'error', this.fromState, this.registryId,
      ));
  }

  confirmRegeneration() {
    this.confirmed = true;
    this.generateCredentials();
  }

  generateCredentials() {
    this.isLoading = true;
    return this.privateRegistryService.generateCredentials(this.projectId, this.registryId)
      .then((credentials) => {
        this.isLoading = false;
        this.credentials = credentials;
      })
      .catch(error => this.goBack(
        this.$translate.instant('private_registry_generate_credentials_error', {
          message: get(error, 'data.message'),
          registryName: this.registryName,
        }), 'error', this.fromState, this.registryId,
      ));
  }

  goToHarborUI() {
    this.$window.open(this.harborURL, '_blank');
    this.goBack();
  }
}
