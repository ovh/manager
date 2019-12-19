export default /* @ngInject */ function ($translate, $q, $stateParams,
  PAGINATION_PER_PAGE, OvhApiOverTheBox, TucToast) {
  const self = this;

  self.loaders = {
    init: true,
  };

  self.taskIds = [];
  self.tasks = [];
  self.serviceName = $stateParams.serviceName;
  self.filter = {
    perPage: PAGINATION_PER_PAGE,
  };

  self.$onInit = function $onInit() {
    $q.all([
      self.getTasks(),
    ]);
  };

  self.getTasks = function getTasks() {
    OvhApiOverTheBox.v6().getTasks({ serviceName: $stateParams.serviceName }).$promise.then(
      (taskIds) => {
        self.taskIds = taskIds.map((taskId) => ({ id: taskId }));
      },
      (error) => {
        TucToast.error([$translate.instant('an_error_occured'), error.data.message].join(' '));
      },
    );
  };

  self.transformItem = function transformItem(row) {
    return OvhApiOverTheBox.v6()
      .getTask({ serviceName: $stateParams.serviceName, taskId: row.id }).$promise.then(
        (task) => task,
        (error) => {
          TucToast.error([$translate.instant('an_error_occured'), error.data.message].join(' '));
        },
      );
  };
}
