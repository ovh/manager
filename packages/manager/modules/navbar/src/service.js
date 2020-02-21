import { User } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  getUser() {
    return this.$q
      .all({
        user: this.$http.get('/me').then(({ data }) => data),
        certificates: this.$http
          .get('/me/certificates')
          .then(({ data }) => data),
      })
      .then(({ user, certificates }) => new User(user, certificates));
  }

  getSupportLevel() {
    return this.$http
      .get('/me/supportLevel')
      .then(({ data }) => data)
      .catch(() => Promise.resolve(null));
  }

  getUniverses(version) {
    return this.$http
      .get('/universes', {
        serviceType: 'aapi',
        params: {
          version,
        },
      })
      .then(({ data }) => data);
  }
}
