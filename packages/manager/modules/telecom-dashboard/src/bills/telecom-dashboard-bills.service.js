export default class {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLastBills() {
    return this.$http.get(`/me/bill`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '6',
        'X-Pagination-Sort': 'date',
        'X-Pagination-Sort-Order': 'DESC',
      },
    });
  }
}
