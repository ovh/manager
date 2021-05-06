export default class {
  /* @ngInject */
  constructor(CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loadMessages();
  }

  openAddIp() {
    this.trackDatabases('dashboard::allowed-ips::add_ips');
    this.goToAddIp();
  }

  openUpdateIp(ip) {
    this.trackDatabases('dashboard::allowed-ips::options::update_ips');
    this.goToUpdateIp(ip);
  }

  openDeleteIp(ip) {
    this.trackDatabases('dashboard::allowed-ips::options::delete_ips');
    this.goToDeleteIpBlock(ip);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.storages.databases.dashboard.allowed-ips',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.databases.dashboard.allowed-ips',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
