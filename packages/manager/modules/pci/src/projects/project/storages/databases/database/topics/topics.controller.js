export default class databasesCtrl {
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
      'pci.projects.project.storages.databases.dashboard.topics';
    this.loadMessages();
    this.trackDatabases('dashboard::topics', 'page');
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

  refreshTopics() {
    this.DatabaseService.getTopics(
      this.projectId,
      this.database.engine,
      this.database.id,
    ).then((topicsList) => {
      this.topicsList = topicsList;
      this.refreshing = false;
    });
  }
}
