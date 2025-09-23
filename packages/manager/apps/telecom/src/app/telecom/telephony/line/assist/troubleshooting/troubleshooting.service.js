export default class TelephonyLineAssistTroubleshootingService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  myIp() {
    return this.$http.post('/me/geolocation').then(({ data }) => data);
  }
}
