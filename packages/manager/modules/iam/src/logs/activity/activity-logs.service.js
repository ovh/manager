export const URL = {
  LOG: '/me/api/log/url',
  LOG_KIND: '/me/api/log/kind',
  LOG_SUSBSCRIPTION: '/me/api/log/subscription',
};

export default class IAMActivityLogsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getLogKinds() {
    return this.$http.get(URL.LOG_KIND).then(({ data }) => data);
  }
}
