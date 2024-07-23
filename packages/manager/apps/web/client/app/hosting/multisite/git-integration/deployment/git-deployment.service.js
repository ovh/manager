export default class HostingMultisiteGitDeploymentService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  postWebsiteDeploy(serviceName, id, reset) {
    return this.$http
      .post(`/hosting/web/${serviceName}/website/${id}/deploy`, {
        reset,
      })
      .then(({ data }) => data);
  }
}
