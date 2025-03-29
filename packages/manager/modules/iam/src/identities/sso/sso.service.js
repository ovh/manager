export default class IamSsoService {
  /* @ngInject */
  constructor($http, $rootScope) {
    this.$http = $http;
    this.$rootScope = $rootScope;
  }

  broadcast(broadcast, response) {
    return this.$rootScope.$broadcast(broadcast, response);
  }

  getIdentityProvider() {
    return this.$http.get('/me/identity/provider').then(({ data }) => data);
  }

  addIdentityProvider(postData) {
    return this.$http
      .post('/me/identity/provider', postData)
      .then(({ data }) => data)
      .then((response) => {
        this.broadcast('iam.sso.refresh', response);
        return response;
      });
  }

  updateIdentityProvider(data) {
    return this.$http
      .put('/me/identity/provider', {
        groupAttributeName: data.groupAttributeName,
        userAttributeName: data.userAttributeName,
        disableUsers: data.disableUsers,
      })
      .then(() => this.broadcast('iam.sso.refresh', {}));
  }

  deleteIdentityProvider() {
    return this.$http
      .delete('/me/identity/provider')
      .then(() => this.broadcast('iam.sso.refresh', {}));
  }
}
