export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.service = DatabaseService;
  }

  forkInstance() {
    this.trackDatabases('dashboard::backups::options_menu::fork_validate');
    this.isLoading = true;
    this.goToFork(this.backupInstance, this.database);
  }

  cancel() {
    this.trackDatabases('dashboard::backups::options_menu::fork_cancel');
    this.goBack();
  }
}
