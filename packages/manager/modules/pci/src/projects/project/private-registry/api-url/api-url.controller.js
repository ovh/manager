export default class PrivateRegistryApiUrlCtrl {
  /* @ngInject */
  constructor($state, $stateParams) {
    this.$state = $state;
    this.harborApiUrl = $stateParams.url;
  }

  goBack() {
    this.trackClick('PCI_PROJECTS_PRIVATEREGISTRY_API-URL_CLOSE');
    this.$state.go('^');
  }
}
