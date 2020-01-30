angular.module('managerApp').component('promiseTaskState', {
  templateUrl:
    'app/cloud/components/runabove/promise-task-state/promise-task-state.html',
  controller: /* @ngInject */ function CloudStorageContainerTasksRunnerController(
    $timeout,
    CloudStorageContainerTasksRunner,
  ) {
    const self = this;

    self.showDetails = false;
    self.taskCount = NaN;
    self.closeTimeout = null;
    self.runner = CloudStorageContainerTasksRunner;

    self.sumTasks = function sumTasks() {
      return CloudStorageContainerTasksRunner.countTotalTasks();
    };

    self.getGlobalProgress = function getGlobalProgress(state) {
      let percents;
      switch (state) {
        case 'done':
          percents = Math.round(
            (CloudStorageContainerTasksRunner.countDoneTasks() /
              self.sumTasks()) *
              100,
          );
          break;
        case 'error':
          percents = Math.round(
            (CloudStorageContainerTasksRunner.countErrorTasks() /
              self.sumTasks()) *
              100,
          );
          break;
        case 'pending':
          percents = Math.round(
            (CloudStorageContainerTasksRunner.countPendingTasks() /
              self.sumTasks()) *
              100,
          );
          break;
        default:
          break;
      }
      if (state === 'done' && percents === 100) {
        self.closeTimeout = $timeout(() => {
          self.close();
        }, 3000);
      }
      return percents;
    };

    self.show = function show(state) {
      if (self.showDetails === state) {
        self.showDetails = false;
        return;
      }
      self.showDetails = state;
    };

    // self.retry = function retry(task) {
    //     Task.retry(task);
    // };

    // self.abort = function abort(task) {
    //     Task.abort(task);
    // };

    self.close = function close() {
      if (self.closeTimeout) {
        $timeout.cancel(self.closeTimeout);
        self.closeTimeout = null;
      }
      CloudStorageContainerTasksRunner.flush();
    };
  },
});
