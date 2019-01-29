angular.module('managerApp')
  .controller('XdslTasksCtrl', function ($scope, $stateParams, $translate, OvhApiXdsl, Toast, PAGINATION_PER_PAGE) {
    const self = this;

    self.taskIds = [];
    self.tasks = [];
    self.serviceName = $stateParams.serviceName;
    self.filter = {
      perPage: PAGINATION_PER_PAGE,
    };

    self.$onInit = function () {
      self.getTasks();
    };

    self.getTasks = function () {
      self.isLoading = true;
      self.taskIds = null;
      return OvhApiXdsl.v6().getTasks({ xdslId: $stateParams.serviceName }).$promise.then(
        (taskIds) => {
          self.taskIds = taskIds.map(taskId => ({ id: taskId }));
        },
        (error) => {
          Toast.error([$translate.instant('an_error_occured'), error.data.message].join(' '));
        },
      ).finally(() => {
        self.isLoading = false;
      });
    };

    self.transformItem = function (id) {
      return OvhApiXdsl.v6()
        .getTask({ xdslId: $stateParams.serviceName, taskId: id }).$promise.then(
          task => task,
          (error) => {
            Toast.error([$translate.instant('an_error_occured'), error.data.message].join(' '));
          },
        );
    };

    self.refresh = function () {
      self.getTasks();
    };
  });
