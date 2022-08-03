export default class TelephonyPortabilitiesRelaunchCtrl {
  /* @ngInject */
  constructor($translate, TelephonyPortabilitiesService) {
    this.$translate = $translate;
    this.TelephonyPortabilitiesService = TelephonyPortabilitiesService;
    this.isRelaunching = false;
  }

  $onInit() {
    this.model = {
      mandatoryParameters: this.changeRequired.mandatoryParameters.reduce(
        (acc, value) => {
          acc[value] = null;
          return acc;
        },
        {},
      ),
      optionalParameters: this.changeRequired.optionalParameters.reduce(
        (acc, value) => {
          acc[value] = null;
          return acc;
        },
        {},
      ),
    };
  }

  relaunchPortability() {
    this.isRelaunching = true;

    const changesForPortability = Object.entries({
      ...this.model.mandatoryParameters,
      ...this.model.optionalParameters,
    }).flatMap(([key, value]) => {
      return value !== null
        ? Object.fromEntries([
            ['key', key],
            ['value', value],
          ])
        : [];
    });

    return this.TelephonyPortabilitiesService.relaunchPortability(
      this.billingAccount,
      this.portabilityId,
      changesForPortability,
    )
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'telephony_alias_portabilities_relaunch_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'telephony_alias_portabilities_relaunch_error',
            { error: error?.data?.message },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isRelaunching = false;
      });
  }
}
