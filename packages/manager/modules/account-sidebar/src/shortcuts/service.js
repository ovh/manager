export default class {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  canChangeContact() {
    return this.$http.get('2api/contacts/services', {
      params: {
        dryRun: true,
      },
    });
  }
}
