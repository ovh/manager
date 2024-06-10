export default class NetAppVolumesDashboardSnapshotsRestoreController {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
  }

  /**
   * Work In Progress
   * TODO:
   * - Define which snapshot will be the one to revert to
   * - Make the revert on click to confirm
   * */
  $onInit() {
    this.isLoading = false;
  }

  goBack() {
    this.trackClick('restore::cancel');
    return this.goToSnapshots();
  }

  restoreVolume() {
    this.trackClick('restore::confirm');
    return;
  }
}
