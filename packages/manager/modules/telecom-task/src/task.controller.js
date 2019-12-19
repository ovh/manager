import map from 'lodash/map';

export default class {
  /* @ngInject */

  constructor(
    $scope,
    $translate,
    OvhApiPackXdslTask,
    TucToastError,
    TELECOM_TASK_STATUS,
    TELECOM_TASK_PAGINATION_PER_PAGE,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiPackXdslTask = OvhApiPackXdslTask;
    this.TucToastError = TucToastError;
    this.statusInfo = TELECOM_TASK_STATUS;
    this.TELECOM_TASK_PAGINATION_PER_PAGE = TELECOM_TASK_PAGINATION_PER_PAGE;
  }

  $onInit() {
    this.allTasks = {
      sortby: 'pack',
      reverse: false,
      result: {
        data: [],
        count: 0,
      },
      filter: {
        page: 1,
        perPage: this.TELECOM_TASK_PAGINATION_PER_PAGE,
        status: 'todo doing cancelled error problem',
      },
      tip: this.$translate.instant('telecom_task_all'),
    };

    this.getTasks();

    this.$scope.$watch('TaskCtrl.allTasks.filter.page', (newPage, oldPage) => {
      if (newPage && (newPage !== oldPage)) {
        this.getTasks();
      }
    });
  }

  getTasks() {
    if (this.allTasks.sortby) {
      this.allTasks.filter.sort = `${this.allTasks.sortby} ${this.allTasks.reverse ? 'ASC' : 'DESC'}`;
    }
    this.allTasks.loading = true;
    this.allTasks.result.data = [];

    return this.OvhApiPackXdslTask
      .Aapi()
      .detailsAll(this.allTasks.filter)
      .$promise
      .catch((error) => new this.TucToastError(error))
      .then((data) => map(data, (task) => ({
        ...task,
        status: {
          icon: this.statusInfo[task.status].icon,
          name: task.status,
          tip: this.$translate.instant(`telecom_task_${task.status}`),
        },
      })))
      .then((tasks) => {
        this.allTasks.result.data = tasks;
      })
      .finally(() => {
        this.allTasks.loading = false;
      });
  }
}
