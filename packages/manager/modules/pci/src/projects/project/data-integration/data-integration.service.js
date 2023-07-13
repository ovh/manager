export default class DataIntegrationService {
  /* @ngInject */
  constructor($http, $q, $translate, iceberg, CucPriceHelper, Poller) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.iceberg = iceberg;
    this.CucPriceHelper = CucPriceHelper;
    this.Poller = Poller;
  }

  static getIcebergHeaders() {
    return {
      headers: {
        Pragma: 'no-cache',
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
      },
    };
  }

  getWorkflows(serviceName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/dataIntegration/workflows`,
        DataIntegrationService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getJobs(serviceName, workflowId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/dataIntegration/workflows/${workflowId}/jobs`,
        DataIntegrationService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }
}
