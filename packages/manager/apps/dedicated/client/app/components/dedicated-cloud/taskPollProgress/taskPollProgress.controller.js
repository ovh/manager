import {
  DEFAULT_TIMER,
  STATUS_POLL_READY,
  TASK_STATE,
} from './taskPollProgress.constant';

export default class DedicatedCloudTaskPollProgressCtrl {
  /* @ngInject */
  constructor($timeout, $translate, DedicatedCloud) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.TASK_STATE = TASK_STATE;
  }

  $onInit() {
    this.getTaskPool();
  }

  getTaskPool() {
    return this.DedicatedCloud.getOperation(this.productId, {
      taskId: this.task.taskId,
    }).then((task) => {
      this.task = {
        ...task,
        percentage: `(${task.progress}%)`,
      };
      if (STATUS_POLL_READY.includes(task.state)) {
        return this.$timeout(() => this.getTaskPool(), DEFAULT_TIMER);
      }
      if (this.trackingTaskTag[task.state]) {
        this.trackPage(this.trackingTaskTag[task.state]);
      }
      this.loaders.action = false;
      return task;
    });
  }
}
