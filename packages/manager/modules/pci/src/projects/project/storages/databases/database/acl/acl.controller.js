export default class aclCtrl {
  /* @ngInject */
  constructor($anchorScroll, $translate, $q, CucCloudMessage, DatabaseService) {
    this.$anchorScroll = $anchorScroll;
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.acl';
    this.loadMessages();
    this.trackDatabases('dashboard::acl', 'page');
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  refreshAcl() {
    this.DatabaseService.getServiceDatabases(
      this.projectId,
      this.database.engine,
      this.database.id,
    ).then((aclList) => {
      this.aclList = aclList;
    });
  }
}
