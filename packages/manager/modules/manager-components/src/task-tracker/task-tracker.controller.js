import { POLL_INTERVAL, TASK_STATUS } from './task-tracker.constants';

export default class TaskTrackerController {
  /* @ngInject */
  constructor($translate, $timeout, $http, TaskTrackerService) {
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.$http = $http;
    this.TaskTrackerService = TaskTrackerService;

    this.httpError = null;
    this.timeoutPromise = null;
    this.steps = [];
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

  get isClosable() {
    return this.isDone || Boolean(this.errorMessage);
  }

  get errorMessage() {
    if (this.httpError) {
      return (
        this.httpError.data?.message ||
        this.httpError.message ||
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
    this.buildSteps();
    this.poll();
  }

  $onDestroy() {
    this.$timeout.cancel(this.timeoutPromise);
  }

  poll() {
    if (this.isClosable) {
      return;
    }

    this.timeoutPromise = this.$timeout(() => {
      this.TaskTrackerService.getTasks(
        this.endpoint,
        this.tasks.map(({ taskId }) => taskId),
      )
        .then((tasks) => {
          this.tasks = tasks;
        })
        .catch((error) => {
          this.httpError = error;
        })
        .finally(() => {
          this.buildSteps();
          this.poll();
        });
    }, (this.interval || POLL_INTERVAL) * 1000);
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
