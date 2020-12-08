import filter from 'lodash/filter';

export default /* @ngInject */ function PackTaskCtrl(
  $scope,
  $translate,
  PAGINATION_PER_PAGE,
  TASK_STATUS,
  OvhApiPackXdslTask,
  TucToastError,
) {
  const self = this;
  this.allTasks = [];
  this.statusFilteredTasks = [];
  this.paginatedTasks = [];
  this.filter = {
    perPage: PAGINATION_PER_PAGE,
    page: 1,
  };

  const getData = function getData() {
    return OvhApiPackXdslTask.Aapi()
      .details({
        packName: $scope.Pack.pack.packName,
      })
      .$promise.then((data) => {
        self.allTasks = data;
      }, TucToastError);
  };

  const assignStatusToTasks = function assignStatusToTasks() {
    for (let i = 0; i < self.allTasks.length; i += 1) {
      const { status } = self.allTasks[i];
      self.allTasks[i].status = self.status[self.allTasks[i].status];
      if (self.allTasks[i].status && status) {
        self.allTasks[i].status.tip = $translate.instant(
          `telecom_task_${status}`,
        );
        self.allTasks[i].status.name = status;
      }
    }
  };

  self.updateFilteredTasks = function updateFilteredTasks() {
    let result = self.allTasks;

    if (self.filter.status) {
      result = filter(
        self.allTasks,
        (elem) => elem.status.name === self.filter.status,
      );
    }

    self.statusFilteredTasks = result;
  };

  self.getStatusFilter = function getStatusFilter() {
    const result = [
      {
        icon: '',
        title: $translate.instant('telecom_task_status'),
        tip: $translate.instant('telecom_task_filter_none'),
        default: true,
      },
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const i in self.status) {
      // eslint-disable-next-line no-prototype-builtins
      if (self.status.hasOwnProperty(i)) {
        self.status[i].status = i;
        self.status[i].title = $translate.instant(`telecom_task_${i}`);
        self.status[i].tip = $translate.instant(`telecom_task_${i}`);
        result.push(self.status[i]);
      }
    }

    return result;
  };

  self.filterTasksByStatus = function filterTasksByStatus(item) {
    self.filter.status = item.status;
    self.updateFilteredTasks();
  };

  const init = function init() {
    self.status = TASK_STATUS;
    self.filterChoices = self.getStatusFilter();
    self.filterSelect = {
      status: self.filterChoices[0],
    };

    getData().then(() => {
      assignStatusToTasks();
      self.updateFilteredTasks();
    });
  };

  init();
}
