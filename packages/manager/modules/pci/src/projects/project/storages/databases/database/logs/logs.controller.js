import moment from 'moment';

export default class logsCtrl {
  /* @ngInject */
  constructor(
    $anchorScroll,
    $translate,
    $q,
    CucCloudMessage,
    DatabaseService,
    $scope,
    $timeout,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
    this.findMessageLevel = logsCtrl.findMessageLevel;
    this.formatTimestamp = logsCtrl.formatTimestamp;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.logs';
    this.loadMessages();
    this.trackDatabases('dashboard::logs', 'page');
    this.pollLogs = true;
    this.logs = [];
    // retrieve logs a first time, then start polling
    this.DatabaseService.getDatabaseLogs(
      this.projectId,
      this.database.engine,
      this.database.id,
    )
      .then((data) => {
        this.logs = data;
      })
      .finally(() => {
        this.logsPoller = setInterval(() => {
          if (this.pollLogs && !this.pendingFlag) {
            this.pendingFlag = true;
            this.DatabaseService.getDatabaseLogs(
              this.projectId,
              this.database.engine,
              this.database.id,
            )
              .then((data) => {
                this.logs = data;
              })
              .finally(() => {
                this.pendingFlag = false;
              });
          }
        }, 3000);
      });
  }

  $onDestroy() {
    if (this.logsPoller) {
      clearInterval(this.logsPoller);
    }
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

  static formatTimestamp(timestamp) {
    return moment(timestamp * 1000).format();
  }

  static findMessageLevel(message) {
    return {
      debug: message.startsWith('DEBUG'),
      info: message.startsWith('INFO'),
      warning: message.startsWith('WARNING'),
      error: message.startsWith('ERROR'),
    };
  }
}
