export default class TelephonyProcedureController {
  /* @ngInject */
  constructor($http, $q, coreURLBuilder, ovhFeatureFlipping) {
    this.$http = $http;
    this.$q = $q;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.telephonyProcedureRequired = false;
    const featureName = 'telecom,telephony';

    return this.ovhFeatureFlipping
      .checkFeatureAvailability(featureName)
      .then((featureAvailability) => {
        const isTelecomAvailable = featureAvailability.isFeatureAvailable(
          'telecom',
        );
        if (isTelecomAvailable) {
          this.identityCheckFormLink = this.coreURLBuilder.buildURL(
            'telecom',
            '#/identity-check',
          );
        }

        return featureAvailability.isFeatureAvailable('telephony')
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
