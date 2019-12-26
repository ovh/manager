export default class PrivateRegistryApiUrlCtrl {
  /* @ngInject */
  constructor($state, $stateParams) {
    this.$state = $state;
    this.harborApiUrl = $stateParams.url;
  }

  goBack() {
    this.$state.go('^');
  }
}
