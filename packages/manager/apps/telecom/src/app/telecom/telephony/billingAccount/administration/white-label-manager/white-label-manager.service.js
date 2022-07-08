export default class TelecomTelephonyWhiteLabelManagerService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  resellerPanelResetPassword() {
    return this.$http
      .post('/telephony/resellerPanel/generatePassword')
      .then(({ data }) => data);
  }
}
