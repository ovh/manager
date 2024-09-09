export default class SshKeyService {
  /* @ngInject */
  constructor($http, OvhApiMe) {
    this.$http = $http;
    this.OvhApiMe = OvhApiMe;
  }

  getSshKeys() {
    return this.OvhApiMe.SshKey()
      .v6()
      .query().$promise;
  }

  getSshKeyInfo(selectedSshKey) {
    return this.$http.get(`/me/sshKey/${selectedSshKey}`).then((data) => data);
  }
}
