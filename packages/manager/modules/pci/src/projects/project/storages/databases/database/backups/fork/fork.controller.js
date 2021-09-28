export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.service = DatabaseService;
  }

  forkInstance() {
    this.trackDashboard('backups::options_menu::fork_validate');
    this.isLoading = true;
    this.goToFork(this.backupInstance, this.database);
  }

  cancel() {
    this.trackDashboard('backups::options_menu::fork_cancel');
    this.goBack();
  }
}
