export default class HostingMultisiteGitDeploymentService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getWebsitesAssociated(serviceName, path) {
    return this.$http
      .get(`/hosting/web/${serviceName}/website?path=${path}`)
      .then(({ data }) => data);
  }

  postWebsiteDeploy(serviceName, id, reset) {
    return this.$http
      .post(`/hosting/web/${serviceName}/website/${id}/deploy`, {
        reset,
      })
      .then(({ data }) => data);
  }
}
