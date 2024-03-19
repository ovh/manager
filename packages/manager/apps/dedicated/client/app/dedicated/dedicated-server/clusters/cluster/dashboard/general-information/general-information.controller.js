export default class DedicatedClusterGeneralInformationController {
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
