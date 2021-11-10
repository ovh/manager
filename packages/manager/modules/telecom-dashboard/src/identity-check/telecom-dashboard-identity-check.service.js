export default class {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  isIdentityChecked() {
    return this.$http
      .get('/telephony', {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Filter': 'trusted:eq=false',
          'X-Pagination-Size': 1,
        },
      })
      .then((response) => {
        return response.headers('x-pagination-elements') === '0';
      });
  }
}
