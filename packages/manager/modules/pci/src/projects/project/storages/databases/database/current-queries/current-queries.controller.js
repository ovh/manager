import {
  TRACKING_INFO,
  IDLE_QUERY_STATES,
  ACTIVE_QUERY_STATE,
} from './current-queries.constants';
import { CURRENT_QUERIES_INTERVAL } from '../../databases.constants';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, DatabaseService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard(TRACKING_INFO.CURRENT_QUERIES, 'page');
    this.showIdleConnections = false;
    this.showActiveConnections = false;
    this.autorefreshPage = false;
    this.loading = {
      queries: false,
    };
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.current-queries';
    this.loadMessages();
    this.getCurrentQueries();
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

  getCurrentQueries() {
    this.loading.queries = true;
    return this.DatabaseService.getCurrentQueries(
      this.projectId,
      this.database.id,
      this.database.engine,
    )
      .then(([currentQueries]) => {
        this.currentQueries = currentQueries;
        return this.setDisplayQueries();
      })
      .catch((error) => {
        return this.CucCloudMessage.error(
          this.$translate.instant('pci_databases_current_queries_fetch_error', {
            message: error.data?.message || error.message,
          }),
          this.messageContainer,
        );
      })
      .finally(() => {
        this.loading.queries = false;
      });
  }

  setDisplayQueries() {
    this.displayQueries = this.currentQueries.filter(
      (query) =>
        (this.showIdleConnections ||
          !IDLE_QUERY_STATES.some((state) => state === query.state)) &&
        (this.showActiveConnections || query.state !== ACTIVE_QUERY_STATE),
    );
  }

  onShowIdleConnectionsChange(showIdleConnections) {
    this.showIdleConnections = showIdleConnections;
    this.trackDashboard(
      showIdleConnections
        ? TRACKING_INFO.IDLE_CONNECTIONS_ENABLE
        : TRACKING_INFO.IDLE_CONNECTIONS_DISABLE,
      'action',
    );
    this.setDisplayQueries();
  }

  onShowActiveConnectionsChange(showActiveConnections) {
    this.showActiveConnections = showActiveConnections;
    this.trackDashboard(
      showActiveConnections
        ? TRACKING_INFO.ACTIVE_CONNECTIONS_ENABLE
        : TRACKING_INFO.ACTIVE_CONNECTIONS_DISABLE,
      'action',
    );
    this.setDisplayQueries();
  }

  onPageAutoRefreshChange(autorefreshPage) {
    this.autorefreshPage = autorefreshPage;
    this.trackDashboard(
      autorefreshPage
        ? TRACKING_INFO.AUTO_REFRESH_ENABLE
        : TRACKING_INFO.AUTO_REFRESH_DISABLE,
      'action',
    );
    if (autorefreshPage) {
      this.getCurrentQueries();
      this.refreshTimer = setInterval(() => {
        this.getCurrentQueries();
      }, CURRENT_QUERIES_INTERVAL);
    } else {
      clearInterval(this.refreshTimer);
    }
  }

  $onDestroy() {
    clearInterval(this.refreshTimer);
  }
}
