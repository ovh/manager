export default class UseraccountUsersService {
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
      .then(() => this.broadcast('useraccount.security.users.refresh', {}));
  }

  updateUser({ login, email, description, group }) {
    return this.$http
      .put(`/me/identity/user/${login}`, {
        email,
        description,
        group,
      })
      .then(() => this.broadcast('useraccount.security.users.refresh', {}));
  }

  deleteUser(user) {
    return this.$http
      .delete(`/me/identity/user/${user.login}`)
      .then(() => this.broadcast('useraccount.security.users.refresh', {}));
  }

  enableUser(user) {
    return this.$http
      .post(`/me/identity/user/${user.login}/enable`)
      .then(() => this.broadcast('useraccount.security.users.refresh', {}));
  }

  disableUser(user) {
    return this.$http
      .post(`/me/identity/user/${user.login}/disable`)
      .then(() => this.broadcast('useraccount.security.users.refresh', {}));
  }

  getIdentityProvider() {
    return this.$http.get('/me/identity/provider').then(({ data }) => data);
  }

  addIdentityProvider(postData) {
    return this.$http
      .post('/me/identity/provider', postData)
      .then(({ data }) => data)
      .then((response) => {
        this.broadcast('useraccount.security.users.refresh', response);
        return response;
      });
  }

  updateIdentityProvider(data) {
    return this.$http
      .put('/me/identity/provider', {
        groupAttributeName: data.groupAttributeName,
      })
      .then(() => this.broadcast('useraccount.security.users.refresh', {}));
  }

  deleteIdentityProvider() {
    return this.$http
      .delete('/me/identity/provider')
      .then(() => this.broadcast('useraccount.security.users.refresh', {}));
  }
}
