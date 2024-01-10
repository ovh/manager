export default class BmClusterComponentsGeneralInformationController {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  goToEditName(displayName) {
    this.$state.go(
      'app.dedicated-cluster.cluster.dashboard.edit-display-name',
      {
        displayName,
      },
    );
  }
}
