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
   * Function to map and add database and user to pool class
   * Also adds username and database name
   */
  initData() {
    this.pools.forEach((pool) => {
      const database = this.postgresDatabases.find(
        (db) => db.id === pool.databaseId,
      );
      const user = this.users.find((obj) => obj.id === pool.userId);
      pool.setDatabase(database);
      pool.setUser(user);
      pool.setUserName(user?.username);
      pool.setDatabaseName(database?.name);
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
