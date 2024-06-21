export default class HostingMultisiteGitAssociationService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getVcsWebhookUrls(serviceName, path, vcs) {
    return this.$http
      .get(`/hosting/web/${serviceName}/vcs/webhooks?path=${path}&vcs=${vcs}`)
      .then(({ data }) => data);
  }

  getSshKey(serviceName) {
    return this.$http
      .get(`/hosting/web/${serviceName}/key/ssh`)
      .catch((error) => {
        if (error.status === 404) {
          return this.$http.post(`/hosting/web/${serviceName}/key/ssh`);
        }
        throw error;
      })
      .then(({ data }) => data.publicKey);
  }
}
