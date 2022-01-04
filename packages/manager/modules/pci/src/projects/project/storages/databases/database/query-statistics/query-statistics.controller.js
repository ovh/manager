export default class {
  /* @ngInject */
  constructor($timeout, $translate, CucCloudMessage, DatabaseService) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.query-statistics';
    this.loadMessages();
    this.trackDashboard('query_statistics', 'page');
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

  resetStatistics() {
    this.resetLoading = true;
    this.trackDashboard('query_statistics::reset_statistics');
    return this.DatabaseService.resetQueryStatistics(
      this.projectId,
      this.database.engine,
      this.database.id,
    )
      .then(() => {
        // added timeout as a work-around to avoid the aiven bug
        // there needs to be a delay while executing PUT and GET request to get updated data
        return this.$timeout(() => {
          this.goBackToQueryStatistics(
            this.$translate.instant(
              'pci_databases_query_statistics_reset_success',
            ),
            'success',
          );
        }, 100);
      })
      .catch((error) => {
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_databases_query_statistics_reset_error',
            {
              message: error.data?.message || error.message,
            },
          ),
          this.messageContainer,
        );
      })
      .finally(() => {
        this.resetLoading = false;
      });
  }

  // TBD: To be used when pagination is enabled
  onPageChange({ pageSize, offset }) {
    this.onListParamsChange({
      page: parseInt(offset / pageSize, 10) + 1,
      pageSize,
    });
  }
}
