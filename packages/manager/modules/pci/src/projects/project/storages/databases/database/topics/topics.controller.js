export default class databasesCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.topics';
    this.loadMessages();
    this.trackDashboard('topics', 'page');
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
    this.refreshing = true;
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
