export default class ExchangeTabTasksCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, messaging, $translate, $stateParams) {
    this.services = {
      $scope,
      wucExchange,
      messaging,
      $translate,
      $stateParams,
    };
  }

  $onInit() {
    const params = this.services.wucExchange.getParams();
    this.organization = params.organization;
    this.productId = params.productId;

    this.states = {
      doing: 'doing',
      error: 'error',
      done: 'done',
      cancelled: 'cancelled',
      todo: 'todo',
    };

    this.services.$scope.$on(
      this.services.wucExchange.events.tasksChanged,
      () => this.refreshTasks(),
    );
  }

  static toUpperSnakeCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toUpperCase();
  }

  getTasks({ pageSize, offset }) {
    return this.services.wucExchange
      .getTasks(
        this.organization,
        this.productId,
        pageSize,
        Math.ceil(offset / pageSize),
      )
      .then(({ tasks }) => {
        this.tasksList = tasks;
        return tasks;
      });
  }

  loadPaginated({ pageSize, offset }) {
    this.isLoading = true;
    const { organization, productId } = this.services.$stateParams;
    return this.services.wucExchange
      .getTasks(organization, productId, pageSize, Math.ceil(offset / pageSize))
      .then((tasks) => {
        this.tasksList = tasks;
        return tasks;
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
