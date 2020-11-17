import { User } from '@ovh-ux/manager-models';

export default class SessionService {
  /* @ngInject */

  constructor($q, $http) {
    this.$http = $http;
    this.$q = $q;

    this.user = null;
    this.userPromise = null;
    this.userPromiseRunning = false;
  }

  getMe() {
    return this.$http.get('/me').then(({ data }) => data);
  }

  getUserCertificates() {
    return this.$http.get('/me/certificates').then(({ data }) => data);
  }

  getUser() {
    if (!this.userPromiseRunning && this.user === null) {
      this.userPromiseRunning = true;

      this.userPromise = this.$q.when('start').then(() =>
        this.$q
          .all({
            me: this.getMe(),
            certificates: this.getUserCertificates(),
          })
          .then(({ me, certificates }) => {
            this.userPromiseRunning = false;
            this.user = new User(
              {
                ...me,
                firstName: me.firstname,
                lastName: me.name,
                billingCountry: me.country,
                customerCode: me.customerCode,
              },
              certificates,
            );
          }),
      );
    }

    return this.userPromise.then(() => this.user);
  }
}
