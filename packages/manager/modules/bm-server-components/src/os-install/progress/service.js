export default class DedicatedServerOsInstallProgressService {
  /* @ngInject */
  constructor($http, $q, $translate) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
  }

  getTaskInProgress(serviceName, type) {
    return this.$http
      .get(`/sws/dedicated/server/${serviceName}/tasks/uncompleted`, {
        serviceType: 'aapi',
        params: {
          type,
        },
      })
    .then(({ data }) => data);
  }

  cancelTask(serviceName, taskId) {
    return this.$http.post(`/dedicated/server/${serviceName}/task/${taskId}/cancel`)
      .then(({ data }) => data);
  }

  progressInstallation(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/install/status`)
      .then(({ data }) => data)
      .catch((error) => {
        if (error.status === 460) {
          return [];
        }
        return this.$q.reject(error);
      });
  }


}
