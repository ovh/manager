export default class indexesCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.indexes';
    this.loadMessages();
    this.trackDashboard('indexes', 'page');
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

  refreshPatterns() {
    this.patternRefreshing = true;
    this.DatabaseService.getPatterns(
      this.projectId,
      this.database.engine,
      this.database.id,
    ).then((patternsList) => {
      this.patternsList = patternsList;
      this.patternRefreshing = false;
    });
  }

  trackAndCreatePattern() {
    this.trackDashboard('indexes::add_pattern');
    this.addPattern();
  }

  refreshIndexes() {
    this.indexesRefreshing = true;
    this.DatabaseService.getIndexes(
      this.projectId,
      this.database.engine,
      this.database.id,
    ).then((indexesList) => {
      this.indexesList = indexesList;
      this.indexesRefreshing = false;
    });
  }
}
