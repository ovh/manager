export default class publigGatewaysServiceClass {
  static getIcebergHeaders() {
    return {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
        Pragma: 'no-cache',
      },
    };
  }

  /* @ngInject */
  constructor(OvhApiCloudProjectNetworkPrivate, $http) {
    this.$http = $http;
  }

  getPublicGateways(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/gateway`)
      .then(({ data }) => data);
  }
}
