export default class TelephonyProcedureController {
  /* @ngInject */
  constructor($http, coreURLBuilder) {
    this.$http = $http;

    this.identityCheckFormLink = coreURLBuilder.buildURL(
      'telecom',
      '#/identity-check',
    );
  }

  $onInit() {
    this.telephonyProcedureRequired = false;

    return this.$http
      .get('/telephony/procedure/required')
      .then(({ data: required }) => {
        this.telephonyProcedureRequired = required;
      });
  }
}
