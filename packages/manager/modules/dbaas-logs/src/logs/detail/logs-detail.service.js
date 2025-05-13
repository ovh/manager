export default class LogsDetailService {
  /* @ngInject */
  constructor($q, $http, $translate, CucServiceHelper) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.CucServiceHelper = CucServiceHelper;
  }

  getServiceDetails(serviceName) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}`)
      .then(({ data }) => data)
      .catch(
        this.CucServiceHelper.errorHandler(
          'logs_details_error',
          null,
          'data.message',
        ),
      );
  }
}
