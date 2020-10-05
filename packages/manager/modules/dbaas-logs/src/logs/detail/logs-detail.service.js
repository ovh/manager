export default class LogsDetailService {
  /* @ngInject */
  constructor($q, $translate, OvhApiDbaas, CucServiceHelper) {
    this.$q = $q;
    this.$translate = $translate;
    this.LogsLexiService = OvhApiDbaas.Logs().v6();
    this.CucServiceHelper = CucServiceHelper;
  }

  getServiceDetails(serviceName) {
    return this.LogsLexiService.logDetail({ serviceName }).$promise.catch(
      this.CucServiceHelper.errorHandler(
        'logs_details_error',
        undefined,
        'data.message',
      ),
    );
  }
}
