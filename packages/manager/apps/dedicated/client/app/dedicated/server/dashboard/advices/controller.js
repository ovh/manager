import {
  ADVANCE_COMMERCIAL_RANGE,
  GUARANTEED_BANDWIDTH_1GB_PLAN_CODES,
  BARE_METAL_ADVANCED_WITHOUT_GUARANTEED_BW_TAG,
} from './constants';

export default class DedicatedServerAdvicesCtrl {
  /* @ngInject */
  constructor($translate, Server, ovhFeatureFlipping) {
    this.$translate = $translate;
    this.Server = Server;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.advices = this.loadAdvices();
  }

  loadAdvices() {
    return this.isFeatureAvailable().then((featureAvailable) => {
      if (
        featureAvailable &&
        this.server.commercialRange &&
        this.server.commercialRange.startsWith(ADVANCE_COMMERCIAL_RANGE)
      ) {
        return this.getBandwidth(this.existingBandwidth).then((plans) => {
          const bandwidthGuaranteedPlans = plans.find((plan) =>
            GUARANTEED_BANDWIDTH_1GB_PLAN_CODES.includes(plan.planCode),
          );
          if (bandwidthGuaranteedPlans) {
            return this.getAdvices();
          }
          return null;
        });
      }
      return null;
    });
  }

  isFeatureAvailable() {
    return this.ovhFeatureFlipping
      .checkFeatureAvailability('dedicated-cloud:up-sell-cross-sell')
      .then((featureAvailability) =>
        featureAvailability.isFeatureAvailable(
          'dedicated-cloud:up-sell-cross-sell',
        ),
      );
  }

  getAdvices() {
    return [
      {
        localizedName: this.$translate.instant(
          'server_advices_dedicated_advice1',
        ),
        href: this.publicBandwidthOrderLink,
        tag: BARE_METAL_ADVANCED_WITHOUT_GUARANTEED_BW_TAG,
      },
    ];
  }

  getBandwidth(existingBandwidth) {
    return this.Server.getBareMetalPublicBandwidthOptions(
      this.server.name,
    ).then((plans) =>
      this.Server.getValidBandwidthPlans(plans, existingBandwidth),
    );
  }
}
