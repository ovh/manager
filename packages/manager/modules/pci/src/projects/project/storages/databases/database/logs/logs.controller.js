import moment from 'moment';
import { LOGS_REFRESH_INTERVAL } from '../../databases.constants';

export default class logsCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, DatabaseService) {
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.logs';
    this.loadMessages();
    this.trackDatabases('dashboard::logs', 'page');
    this.pollLogs = false;
    this.logs = [];
    // retrieve logs a first time, then start polling
    this.fetchLogs(true);
    this.logsPoller = setInterval(() => {
      this.fetchLogs(this.pollLogs);
    }, LOGS_REFRESH_INTERVAL);
  }

  fetchLogs(pollLogs) {
    if (pollLogs && !this.pendingFlag) {
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

  static getMessageLevelClassNames(message) {
    return {
      'oui-color-as-400': message.startsWith('DEBUG'),
      'oui-color-aw-100': message.startsWith('INFO'),
      'oui-color-aw-300': message.startsWith('WARNING'),
      'oui-color-ae-400': message.startsWith('ERROR'),
    };
  }
}
