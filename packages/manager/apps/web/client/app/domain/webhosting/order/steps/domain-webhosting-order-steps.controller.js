import {
  CONFIGURATION_OPTIONS,
  WEBHOSTING_ORDER_PRODUCT,
} from '../domain-webhosting-order.constants';

export default class {
  /* @ngInject */
  constructor($translate, $window, RedirectionService) {
    this.$translate = $translate;
    this.$window = $window;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
  }

  $onInit() {
    this.currentIndex = 0;
    this.cartOption = {};
  }

  orderWebhosting() {
    const { enableHosting, enableEmails } = this.cartOption.dnsConfiguration;
    let dnsZoneLabel = CONFIGURATION_OPTIONS.DNS_ZONE.VALUES.NO_CHANGE;
    if (enableHosting && enableEmails) {
      dnsZoneLabel = CONFIGURATION_OPTIONS.DNS_ZONE.VALUES.RESET_ALL;
    }
    if (enableHosting) {
      dnsZoneLabel = CONFIGURATION_OPTIONS.DNS_ZONE.VALUES.RESET_ONLY_A;
    }
    if (enableEmails) {
      dnsZoneLabel = CONFIGURATION_OPTIONS.DNS_ZONE.VALUES.RESET_ONLY_MX;
    }

    const expressOrderJson = {
      planCode: this.cartOption.offer.planCode,
      duration: this.cartOption.offer.durations[0],
      pricingMode: this.cartOption.offer.pricing.pricingMode,
      quantity: 1,
      configuration: [
        {
          label: CONFIGURATION_OPTIONS.LEGACY_DOMAIN,
          value: this.domainName,
        },
        {
          label: CONFIGURATION_OPTIONS.DNS_ZONE.LABEL,
          value: dnsZoneLabel,
        },
      ],
      productId: WEBHOSTING_ORDER_PRODUCT,
    };

    if (this.cartOption.module) {
      expressOrderJson.option = [
        {
          planCode: this.cartOption.module.planCode,
          duration: this.cartOption.module.duration,
          pricingMode: this.cartOption.module.pricingMode,
          quantity: 1,
          configuration: [
            {
              label: CONFIGURATION_OPTIONS.LEGACY_DOMAIN,
              value: this.domainName,
            },
          ],
        },
      ];
    }

    return this.$window.open(
      `${this.expressOrderUrl}?products=${JSURL.stringify([expressOrderJson])}`,
      '_blank',
      'noopener',
    );
  }
}
