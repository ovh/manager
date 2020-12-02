export default /* @ngInject */ function XdslTasksCtrl(
  $scope,
  $stateParams,
  $translate,
  OvhApiXdsl,
  TucToast,
  PAGINATION_PER_PAGE,
) {
  const self = this;

  self.taskIds = [];
  self.tasks = [];
  self.serviceName = $stateParams.serviceName;
  self.filter = {
    perPage: PAGINATION_PER_PAGE,
  };

  self.$onInit = function $onInit() {
    self.getTasks();
  };

  self.getTasks = function getTasks() {
    self.isLoading = true;
    self.taskIds = null;
    return OvhApiXdsl.v6()
      .getTasks({ xdslId: $stateParams.serviceName })
      .$promise.then(
        (taskIds) => {
          self.taskIds = taskIds.map((taskId) => ({ id: taskId }));
        },
        (error) => {
          TucToast.error(
            [$translate.instant('an_error_occured'), error.data.message].join(
              ' ',
            ),
          );
        },
      )
      .finally(() => {
        self.isLoading = false;
      });
  };

  self.transformItem = function transformItem(id) {
    return OvhApiXdsl.v6()
      .getTask({ xdslId: $stateParams.serviceName, taskId: id })
      .$promise.then(
        (task) => task,
        (error) => {
          TucToast.error(
            [$translate.instant('an_error_occured'), error.data.message].join(
              ' ',
            ),
          );
        },
      );
  };

  self.refresh = function refresh() {
    self.getTasks();
  };
}
