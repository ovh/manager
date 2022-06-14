export default class TelephonyProcedureController {
  /* @ngInject */
  constructor($http, $q, $state, ovhFeatureFlipping) {
    this.$http = $http;
    this.$q = $q;
    this.$state = $state;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
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
          this.identityCheckFormLink = this.$state.href('identity-check');
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
