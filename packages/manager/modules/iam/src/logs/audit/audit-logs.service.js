export const URL = {
  LOG: '/me/logs/audit/log/url',
  LOG_KIND: '/me/logs/audit/log/kind',
  LOG_SUSBSCRIPTION: '/me/logs/audit/log/subscription',
};

export default class IAMAuditLogsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogKinds() {
    return this.$http.get(URL.LOG_KIND).then(({ data }) => data);
  }
}
