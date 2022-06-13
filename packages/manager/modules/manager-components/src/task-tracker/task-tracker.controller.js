import { POLL_INTERVAL, TASK_STATUS } from './task-tracker.constants';

let uid = 0;

export default class TaskTrackerController {
  /** @ngInject */
  constructor(Poller) {
    uid += 1;
    this.Poller = Poller;
    this.namespace = `task-tracker-${uid}`;
    this.error = null;
    this.index = -1;
    this.statuses = [TASK_STATUS.Todo, TASK_STATUS.Doing, TASK_STATUS.Done];
  }

  get status() {
    return this.statuses[this.index];
  }

  get isDone() {
    return Boolean(this.error) || this.status === TASK_STATUS.Done;
  }

  isComplete(index) {
    return this.index > index;
  }

  isActive(index) {
    return this.index === index;
  }

  isError(index) {
    return Boolean(this.error) && this.isActive(index);
  }

  isDisabled(index) {
    return Boolean(this.error) && this.index < index;
  }

  $onInit() {
    if (!this.interval) {
      this.interval = POLL_INTERVAL;
    }
    this.interval *= 1000;
    this.nextStep();
  }

  $onDestroy() {
    this.Poller.kill({ namespace: this.namespace });
  }

  nextStep() {
    if (
      [
        TASK_STATUS.Cancelled,
        TASK_STATUS.CustomerError,
        TASK_STATUS.OvhError,
      ].includes(this.task.status)
    ) {
      this.error = { message: this.task.details };
      return;
    }

    this.index = this.statuses.indexOf(this.task.status);

    if ([TASK_STATUS.Todo, TASK_STATUS.Doing].includes(this.status)) {
      this.pollStep();
    }
  }

  pollStep() {
    const { status, endpoint, Poller, namespace, task, interval } = this;
    const { taskId } = task;
    Poller.poll(`${endpoint}/${taskId}`, null, {
      successRule: (polledTask) => {
        this.task = polledTask;
        return this.task.status !== status;
      },
      namespace,
      interval,
    })
      .then(() => {
        this.Poller.kill({ namespace: this.namespace });
        this.nextStep();
      })
      .catch((error) => {
        this.error = error;
      });
  }
}
