import { POLL_INTERVAL, TASK_STATUS } from './task-tracker.constants';

let uid = 0;

export default class TaskTrackerController {
  /** @ngInject */
  constructor($translate, Poller) {
    this.$translate = $translate;

    uid += 1;
    this.Poller = Poller;
    this.pollError = null;
    this.namespace = `task-tracker-${uid}`;
    this.steps = [];
  }

  get statuses() {
    return this.tasks.map(({ status }) => status);
  }

  get isTodo() {
    return this.tasks.every(({ status }) => status === TASK_STATUS.Todo);
  }

  get isDoing() {
    return !this.isTodo && !this.isDone;
  }

  get isDone() {
    return this.tasks.every(({ status }) => status === TASK_STATUS.Done);
  }

  get hasError() {
    return Boolean(this.errorMessage);
  }

  get errorMessage() {
    if (this.pollError) {
      return (
        this.pollError.data?.message ||
        this.pollError.message ||
        this.$translate.instant('task_tracker_empty_error')
      );
    }

    const erroredTask = this.tasks.find(({ status }) =>
      [
        TASK_STATUS.Cancelled,
        TASK_STATUS.CustomerError,
        TASK_STATUS.OvhError,
      ].includes(status),
    );

    if (erroredTask) {
      return (
        erroredTask.details ||
        this.$translate.instant('task_tracker_empty_error')
      );
    }

    return '';
  }

  $onInit() {
    const successRule = (task) => this.onTaskPolled(task);
    const interval = (this.interval || POLL_INTERVAL) * 1000;

    this.tasks.forEach(({ taskId }, i) => {
      const namespace = `${this.namespace}-${i}`;

      this.Poller.poll(`${this.endpoint}/${taskId}`, null, {
        successRule,
        namespace,
        interval,
      })
        .catch((error) => {
          this.pollError = error;
        })
        .finally(() => {
          this.Poller.kill({ namespace });
        });
    });

    this.buildSteps();
  }

  $onDestroy() {
    this.tasks.forEach((task, i) =>
      this.Poller.kill({ namespace: `${this.namespace}-${i}` }),
    );
  }

  onTaskPolled(task) {
    Object.assign(
      this.tasks.find(({ taskId }) => taskId === task.taskId),
      task,
    );

    this.buildSteps();

    return this.isDone || this.hasError;
  }

  buildSteps() {
    const { errorMessage, isTodo, isDoing, isDone } = this;

    const todoStep = {
      name: TASK_STATUS.Todo,
      active: isTodo,
      complete: !isTodo,
      disabled: false,
      error: isTodo && errorMessage,
    };

    const doingStep = {
      name: TASK_STATUS.Doing,
      active: isDoing,
      complete: isDone,
      disabled: todoStep.error,
      error: isDoing && errorMessage,
    };

    const doneStep = {
      name: TASK_STATUS.Done,
      active: isDone,
      complete: isDone,
      disabled: doingStep.disabled,
      error: false,
    };

    this.steps = [todoStep, doingStep, doneStep];
  }
}
