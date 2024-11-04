export default class SshKeySelectorService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getSshKeys() {
    return this.$http.get(`/me/sshKey`).then((data) => data);
  }

  getSshKeyInfo(selectedSshKey) {
    return this.$http.get(`/me/sshKey/${selectedSshKey}`).then((data) => data);
  }
}
