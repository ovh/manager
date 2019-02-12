import { PAGINATION_PER_PAGE } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    OvhApiXdsl,
    TucToast,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.taskIds = [];
    this.tasks = [];
    this.serviceName = this.$stateParams.serviceName;
    this.filter = {
      perPage: PAGINATION_PER_PAGE,
    };
    this.getTasks();
  }

  getTasks() {
    this.isLoading = true;
    this.taskIds = null;
    return this.OvhApiXdsl
      .v6()
      .getTasks({ xdslId: this.$stateParams.serviceName })
      .$promise
      .then((taskIds) => {
        this.taskIds = taskIds.map(taskId => ({ id: taskId }));
      },
      (error) => {
        this.TucToast.error([this.$translate.instant('an_error_occured'), error.data.message].join(' '));
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  transformItem(id) {
    return this.OvhApiXdsl
      .v6()
      .getTask({ xdslId: this.$stateParams.serviceName, taskId: id })
      .$promise
      .then(task => task,
        (error) => {
          this.TucToast.error([this.$translate.instant('an_error_occured'), error.data.message].join(' '));
        });
  }

  refresh() {
    this.getTasks();
  }
}
