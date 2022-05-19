export default class TelephonyProcedureController {
  /* @ngInject */
  constructor($http, $q, coreURLBuilder, ovhFeatureFlipping) {
    this.$http = $http;
    this.$q = $q;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.identityCheckFormLink = coreURLBuilder.buildURL(
      'telecom',
      '#/identity-check',
    );
  }

  $onInit() {
    this.telephonyProcedureRequired = false;
    const featureName = 'telephony';

    return this.ovhFeatureFlipping
      .checkFeatureAvailability(featureName)
      .then((telephonyFeatureAvailability) => {
        return telephonyFeatureAvailability.isFeatureAvailable(featureName)
          ? this.$http
              .get('/telephony/procedure/required')
              .then(({ data: required }) => {
                this.telephonyProcedureRequired = required;
              })
          : this.$q.when(false);
      })
      .catch(() => null);
  }
}
