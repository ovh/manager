export default class IdentityService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getGroups() {
    return this.$http.get('/me/identity/group').then(({ data }) => data);
  }

  getUsers() {
    return this.$http.get('/me/identity/user').then(({ data }) => data);
  }
}
