export default class ExchangeTabTasksCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, messaging, $translate) {
    this.services = {
      $scope,
      wucExchange,
      messaging,
      $translate,
    };
  }

  $onInit() {
    const params = this.services.wucExchange.getParams();
    this.organization = params.organization;
    this.productId = params.productId;

    this.states = {
      doing: 'DOING',
      error: 'ERROR',
      done: 'DONE',
      cancelled: 'CANCELLED',
      todo: 'TODO',
    };

    this.services.$scope.$on(
      this.services.wucExchange.events.tasksChanged,
      () => this.refreshTasks(),
    );
  }

  getTasks({ pageSize, offset }) {
    return this.services.wucExchange.getTasks(
      this.organization,
      this.productId,
      pageSize,
      offset - 1,
    );
  }

  loadPaginated($config) {
    this.tasksList = null;
    this.pageSize = $config.pageSize;
    this.offset = $config.offset;
    return this.getTasks($config)
      .then((response) => {
        this.tasksList = response.list.results;
        return {
          data: this.tasksList,
          meta: {
            totalCount: response.count,
          },
        };
      })
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_tab_TASKS_error_message'),
          error,
        );
      });
  }

  refreshTasks() {
    if (!this.tasksList) {
      return undefined;
    }
    const config = { pageSize: this.pageSize, offset: this.offset };
    return this.getTasks(config)
      .then((response) => {
        for (let i = 0; i < response.list.results.length; i += 1) {
          this.tasksList.splice(i, 1, response.list.results[i]);
        }
        for (
          let i = response.list.results.length;
          i < this.tasksList.length;
          i += 1
        ) {
          this.tasksList.splice(i, 1);
        }
      })
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_tab_TASKS_error_message'),
          error,
        );
      });
  }
}
