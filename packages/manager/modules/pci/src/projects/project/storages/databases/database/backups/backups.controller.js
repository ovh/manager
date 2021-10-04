export default class {
  /* @ngInject */
  constructor(CucCloudMessage, ovhManagerRegionService) {
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  $onInit() {
    this.loadMessages();
    this.trackDashboard('backups', 'page');
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.storages.databases.dashboard.backups',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.databases.dashboard.backups',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  forkBackup(backup) {
    this.trackDashboard('backups::options_menu::fork');
    this.goToFork(backup, this.database);
  }

  restoreBackup(backup) {
    this.trackDashboard('backups::options_menu::restore');
    this.goToRestore(backup);
  }

  getExpiryDate(backup) {
    return moment(backup.createdAt)
      .add(this.backupRetentionTime)
      .format();
  }
}
