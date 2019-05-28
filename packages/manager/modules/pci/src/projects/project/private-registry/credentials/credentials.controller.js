import get from 'lodash/get';

export default class PrivateRegistryDeleteCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $window,
    pciPrivateRegistryService,
  ) {
    this.registryId = $stateParams.registryId;
    this.registryName = $stateParams.registryName;
    this.harborURL = $stateParams.harborURL;
    this.confirmationRequired = $stateParams.confirmationRequired;
    this.$translate = $translate;
    this.$window = $window;
    this.privateRegistryService = pciPrivateRegistryService;
    this.confirmed = false;
    this.registryId = $stateParams.registryId;
    this.isLoading = false;
  }

  $onInit() {
    if (this.getRegistry) {
      this.harborURL = this.getRegistry.url;
      this.registryName = this.getRegistry.name;
    }
    if (!this.confirmationRequired) {
      this.confirmRegeneration();
    }
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
        }), 'error', this.registryId,
      ));
  }

  goToHarborUI() {
    this.$window.open(this.harborURL, '_blank');
    this.goBack();
  }
}
