export default class HostingMultisiteGitAssociationService {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
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
        if (error.status === 404 || error.status === 403) {
          return this.$http.post(`/hosting/web/${serviceName}/key/ssh`);
        }
        throw error;
      })
      .then(({ data }) => data.publicKey)
      .catch((error) => {
        if (error.status === 500) {
          return null;
        }
        throw error;
      });
  }

  putWebsiteAssociated(serviceName, vcsBranch, id) {
    return this.$http.put(`/hosting/web/${serviceName}/website/${id}`, {
      vcsBranch,
    });
  }

  getVcsInformations(serviceName, path) {
    return this.iceberg(`/hosting/web/${serviceName}/website?path=${path}`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data: [{ id, vcsUrl, vcsBranch }] }) => ({
        repositoryUrl: vcsUrl,
        branchName: vcsBranch,
        id,
      }));
  }

  postWebsiteAssociated(serviceName, path, vcsBranch, vcsUrl) {
    return this.$http.post(`/hosting/web/${serviceName}/website`, {
      path,
      vcsBranch,
      vcsUrl,
    });
  }
}
