export default class HostingMultisiteGitRemovalService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  deleteGitAssociation(serviceName, domainId, deleteFiles = false) {
    return this.$http
      .delete(
        `/hosting/web/${serviceName}/website/${domainId}?deleteFiles=${deleteFiles}`,
      )
      .then(({ data }) => data);
  }
}
