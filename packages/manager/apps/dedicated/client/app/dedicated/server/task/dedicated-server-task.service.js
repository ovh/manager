export default class {
  constructor($http) {
    this.$http = $http;
  }

  getTasks(serviceName, pageNumber, pageSize) {
    return this.$http.get(`/dedicated/server/${serviceName}/task`, {
      headers: {
        Pragma: 'no-cache',
        'x-pagination-mode': 'CachedObjectList-Pages',
        'x-pagination-number': pageNumber,
        'x-pagination-size': pageSize,
        'x-pagination-sort': 'lastUpdate',
        'x-pagination-sort-order': 'DESC',
      },
    });
  }
}
