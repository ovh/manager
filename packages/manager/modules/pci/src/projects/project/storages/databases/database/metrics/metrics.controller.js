export default class {
  /* @ngInject */
  constructor($anchorScroll, $translate, $q, CucCloudMessage, DatabaseService) {
    this.$anchorScroll = $anchorScroll;
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.isLoading = true;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.metrics';
    this.loadMessages();
    this.trackDatabases('metrics', 'page');

    this.metrics = {
      randomData: [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
      ],
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
      ],
    };

    this.isLoading = false;
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

}
