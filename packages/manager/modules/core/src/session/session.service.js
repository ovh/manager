export default class SessionService {
  /* @ngInject */

  constructor($http) {
    this.$http = $http;
  }

  getUser() {
    return this.$http.get('/me').then(({ data }) => data);
  }
}
