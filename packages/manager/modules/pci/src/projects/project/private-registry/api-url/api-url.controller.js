export default class PrivateRegistryApiUrlCtrl {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
  ) {
    this.$state = $state;
    this.harborApiUrl = $stateParams.url.replace(/^https?:\/\//, '');
  }

  goBack() {
    this.$state.go('^');
  }
}
