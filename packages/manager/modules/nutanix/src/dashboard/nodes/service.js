export default class NutanixNodeService {
  /* @ngInject */
  constructor($q, $http, $translate, NutanixService, Polling) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.NutanixService = NutanixService;
    this.Polling = Polling;
  }

  updateDisplayName({ serviceId, displayName }) {
    return this.$http.put(`/service/${serviceId}`, {
      resource: {
        displayName,
      },
    });
  }

  reboot(serviceName) {
    return this.$http
      .post(`/dedicated/server/${serviceName}/reboot`)
      .then((res) => res.data);
  }

  getServiceInfos(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/serviceInfos`)
      .then(({ data }) => data);
  }

  static getTaskPath(productId, taskId) {
    return `apiv6/dedicated/server/${productId}/task/${taskId}`;
  }

  pollTask(productId, task, pollPromise) {
    this.Polling.addTask(
      NutanixNodeService.getTaskPath(productId, task.id || task.taskId),
      task,
    )
      .then((state) => {
        if (this.Polling.isDone(state)) {
          pollPromise.resolve(state);
        } else {
          this.pollTask(productId, task, pollPromise);
        }
      })
      .catch((data) => {
        pollPromise.reject({ type: 'ERROR', message: data.comment });
      });
  }

  startPolling(nodeId, task) {
    const pollPromise = this.$q.defer();
    this.pollTask(nodeId, task, pollPromise);
    return pollPromise.promise;
  }
}
