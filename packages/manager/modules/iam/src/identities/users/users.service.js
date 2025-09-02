export default class IamUsersService {
  /* @ngInject */
  constructor($http, $rootScope) {
    this.$http = $http;
    this.$rootScope = $rootScope;
  }

  broadcast(broadcast, response) {
    return this.$rootScope.$broadcast(broadcast, response);
  }

  getUsers() {
    return this.$http.get('/me/identity/user').then(({ data }) => data);
  }

  getUser(user) {
    return this.$http.get(`/me/identity/user/${user}`).then(({ data }) => data);
  }

  addUser(data) {
    return this.$http
      .post('/me/identity/user', data)
      .then(() => this.broadcast('iam.security.users.refresh', {}));
  }

  updateUser({ login, email, description, group }) {
    return this.$http
      .put(`/me/identity/user/${login}`, {
        email,
        description,
        group,
      })
      .then(() => this.broadcast('iam.security.users.refresh', {}));
  }

  deleteUser(user) {
    return this.$http
      .delete(`/me/identity/user/${user.login}`)
      .then(() => this.broadcast('iam.security.users.refresh', {}));
  }

  enableUser(user) {
    return this.$http
      .post(`/me/identity/user/${user.login}/enable`)
      .then(() => this.broadcast('iam.security.users.refresh', {}));
  }

  disableUser(user) {
    return this.$http
      .post(`/me/identity/user/${user.login}/disable`)
      .then(() => this.broadcast('iam.security.users.refresh', {}));
  }

  getAuthDetails() {
    return this.$http.get('/auth/details').then(({ data }) => data);
  }
}
