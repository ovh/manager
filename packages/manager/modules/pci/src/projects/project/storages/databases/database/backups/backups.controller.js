export default class {
  /* @ngInject */
  constructor(CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
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
    this.trackDatabases('dashboard::backups::options_menu::fork');
    this.goToFork(backup, this.database);
  }

  restoreBackup(backup) {
    this.trackDatabases('dashboard::backups::options_menu::restore');
    this.goToRestore(backup);
  }

  getExpiryDate(backup) {
    return moment(backup.createdAt)
      .add(this.backupRetentionTime)
      .format();
  }
}
