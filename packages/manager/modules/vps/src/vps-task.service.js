import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import set from 'lodash/set';

export default class VpsTaskService {
  /* @ngInject */
  constructor($http, $q, $rootScope, $translate, CucCloudMessage, CucOvhPoll) {
    this.$http = $http;
    this.$q = $q;
    this.$rootScope = $rootScope;

    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucOvhPoll = CucOvhPoll;

    this.COMPLETED_TASK_PROGRESS = 100;
  }

  initPoller(serviceName, containerName) {
    this.getPendingTasks(serviceName).then((tasks) =>
      this.startTaskPolling(
        serviceName,
        containerName,
        filter(tasks, (task) => task.type !== 'upgradeVm'),
      ),
    );
  }

  getPendingTasks(serviceName, type) {
    return this.$http
      .get(['/sws/vps', serviceName, 'tasks/uncompleted'].join('/'), {
        serviceType: 'aapi',
        params: {
          type,
        },
      })
      .then((data) => data.data)
      .catch((error) => this.$q.reject(error.data));
  }

  getTask(serviceName, taskId) {
    return this.$http
      .get(['/vps', serviceName, 'tasks', taskId].join('/'))
      .then((data) => data.data)
      .catch((error) => this.$q.reject(error.data))
      .finally(() => this.$rootScope.$broadcast('tasks.pending', serviceName));
  }

  startTaskPolling(serviceName, containerName, tasks) {
    this.stopTaskPolling();

    this.poller = this.CucOvhPoll.pollArray({
      items: tasks,
      pollFunction: (task) => this.getTask(serviceName, task.id),
      stopCondition: (task) => includes(['done', 'error'], task.state),
      onItemUpdated: (task) => this.manageMessage(containerName, task),
      onItemDone: (task) =>
        this.manageSuccess(serviceName, containerName, task),
    });
  }

  stopTaskPolling() {
    if (this.poller) {
      this.poller.kill();
    }
  }

  manageSuccess(serviceName, containerName, task) {
    this.flushMessages(containerName, task);
    this.$rootScope.$broadcast('tasks.success', serviceName);
    this.CucCloudMessage.success(
      this.$translate.instant('vps_dashboard_task_finish'),
    );
  }

  manageMessage(containerName, task) {
    this.flushMessages(containerName, task);
    if (task.progress !== this.COMPLETED_TASK_PROGRESS) {
      this.createMessage(containerName, task);
    }
  }

  createMessage(containerName, task) {
    this.CucCloudMessage.warning(
      {
        id: task.id,
        class: 'task',
        title: this.messageType(task.type),
        textHtml: this.template(task.type, task.progress),
        progress: task.progress,
      },
      containerName,
    );
  }

  flushMessages(containerName, task) {
    forEach(this.CucCloudMessage.getMessages(containerName), (message) => {
      if (task && task.id === message.id) {
        set(message, 'dismissed', true);
      } else if (!task && message.class === 'task') {
        set(message, 'dismissed', true);
      }
    });
  }

  template(type, progress) {
    return `${this.messageType(type)} (${progress}%)`;
  }

  messageType(type) {
    return this.$translate.instant(`vps_dashboard_task_${type}`);
  }
}
