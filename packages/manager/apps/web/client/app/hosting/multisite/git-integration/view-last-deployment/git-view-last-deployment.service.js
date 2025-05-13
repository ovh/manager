export default class HostingMultisiteGitViewLastDeploymentService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getWebsitesDeployments(serviceName, id) {
    return this.$http
      .get(`/hosting/web/${serviceName}/website/${id}/deployment`)
      .then(({ data }) => data);
  }

  getWebsitesDeploymentLogs(serviceName, id, deploymentId) {
    return this.$http
      .get(
        `/hosting/web/${serviceName}/website/${id}/deployment/${deploymentId}/logs`,
      )
      .then(({ data }) => data);
  }
}
