export default class UseraccountGroupsService {
  /* @ngInject */
  constructor($http, $rootScope) {
    this.$http = $http;
    this.$rootScope = $rootScope;
  }

  broadcast(broadcast, response) {
    return this.$rootScope.$broadcast(broadcast, response);
  }

  getGroups() {
    return this.$http.get('/me/identity/group').then(({ data }) => data);
  }

  getGroup(group) {
    return this.$http
      .get(`/me/identity/group/${group}`)
      .then(({ data }) => data);
  }

  addGroup(group) {
    return this.$http
      .post('/me/identity/group', {
        name: group.name,
        description: group.description,
        role: group.role,
      })
      .then(({ data }) => data)
      .then((response) => {
        this.broadcast('useraccount.security.users.refresh', response);
        return response;
      });
  }

  updateGroup(group) {
    return this.$http
      .put(`/me/identity/group/${group.name}`, {
        description: group.description,
        role: group.role,
      })
      .then(() => this.broadcast('useraccount.security.users.refresh', {}));
  }

  deleteGroup(group) {
    return this.$http
      .delete(`/me/identity/group/${group.name}`)
      .then(() => this.broadcast('useraccount.security.users.refresh', {}));
  }
}
