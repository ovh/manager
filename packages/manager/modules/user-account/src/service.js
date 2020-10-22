export default class UserAccountService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getUser() {
    return this.getMe().then((result) => ({
      firstName: result.firstname,
      lastName: result.name,
      billingCountry: result.country,
      ...result,
    }));
  }

  getMe() {
    return this.$http
      .get('/me', {
        cache: 'UNIVERS_BILLING_ME',
        rootPath: 'apiv6',
      })
      .then((res) => res.data);
  }
}
