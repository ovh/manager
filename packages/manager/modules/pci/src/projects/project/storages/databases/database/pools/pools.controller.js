export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.initData();
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.pools';
    this.loadMessages();
    this.trackDashboard('pools', 'page');
  }

  /**
   * Function to map and add database name and user name to pool class
   */
  initData() {
    this.pools.forEach((pool) => {
      pool.setDatabaseName(
        this.postgresDatabases.find((db) => db.id === pool.databaseId),
      );
      pool.setUserName(this.users.find((user) => user.id === pool.userId));
    });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  addPool() {
    this.trackDashboard('pools::add_pool');
    // add pool routing and code to go here
  }
}
