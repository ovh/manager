import get from 'lodash/get';

export default class PrivateRegistryDeleteCtrl {
  /* @ngInject */
  constructor($translate, $window, pciPrivateRegistryService) {
    this.$translate = $translate;
    this.$window = $window;
    this.privateRegistryService = pciPrivateRegistryService;
    this.confirmed = false;
    this.isLoading = false;
  }

  $onInit() {
    if (this.registry) {
      this.harborURL = this.registry.url;
      this.registryName = this.registry.name;
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
    return this.privateRegistryService
      .generateCredentials(this.projectId, this.registry.id)
      .then((credentials) => {
        this.isLoading = false;
        this.credentials = credentials;
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'private_registry_generate_credentials_error',
            {
              message: get(error, 'data.message'),
              registryName: this.registryName,
            },
          ),
          'error',
          this.registry.id,
        ),
      );
  }

  goToHarborUI() {
    this.trackClick('PCI_PROJECTS_PRIVATEREGISTRY_CREDENTIALS_CONFIRM');
    this.$window.open(this.harborURL, '_blank');
  }

  cancel(message, type, tag) {
    this.trackClick(tag);
    return this.goToList(message, type);
  }
}
