export default class TelecomTelephonyBillingAccountAdministrationService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  resellerPanelStatus() {
    return this.$http
      .get('/telephony/resellerPanel/status')
      .then(({ data }) => data.enabled);
  }
}
