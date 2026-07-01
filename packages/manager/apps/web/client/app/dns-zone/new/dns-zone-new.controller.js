import get from 'lodash/get';

import {
  ANYCAST_PLAN_CODE,
  CONFIGURATION_LABELS,
  DEFAULT_DURATION,
  DEFAULT_PRICING_MODE,
  DEFAULT_TEMPLATE,
  DNS_PRODUCT_ID,
  TRACKING,
  ZONE_PLAN_CODE,
} from './dns-zone-new.constants';

export default class newDnsZoneCtrl {
  /* @ngInject */
  constructor(
    $window,
    atInternet,
    constants,
    DnsZoneNewService,
    RedirectionService,
  ) {
    this.$window = $window;
    this.atInternet = atInternet;
    this.URLS = constants.urls;
    this.DnsZoneNewService = DnsZoneNewService;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
  }

  $onInit() {
    this.zoneNameisValid = false;
    this.zoneNameError = null;
    this.dnssecAvailable = false;
    // Monotonic counter to drop stale validation responses (fast typing).
    this.checkRequestId = 0;
    this.GUIDE_URL = get(
      this.URLS,
      `${this.user.ovhSubsidiary}.guides.dnsForExternalDomain`,
    );
    this.configuration = {
      zone: null,
      template: DEFAULT_TEMPLATE,
    };
    this.options = {
      anycast: false,
      dnssec: false,
    };
    // Fixed yearly commitment — shown as a pre-selected, disabled 12-month tile.
    this.commitmentDuration = '12';
    this.alerts = {
      main: 'newdnszone.alerts.main',
    };

    this.anycastPrice = this.DnsZoneNewService.getAnycastPrice(this.catalog);
  }

  static getAlerterId(alerter) {
    return alerter.replaceAll('.', '_');
  }

  checkZoneName() {
    this.isLoading = true;
    this.zoneNameisValid = false;
    this.zoneNameError = null;
    this.resetOptions();
    const requestId = (this.checkRequestId += 1);
    return this.DnsZoneNewService.validateZone(
      this.user.ovhSubsidiary,
      this.configuration.zone,
    )
      .then(({ valid, reason, dnssecAvailable }) => {
        // Drop the response if a newer check has started meanwhile.
        if (requestId !== this.checkRequestId) {
          return;
        }
        this.zoneNameisValid = valid;
        this.zoneNameError = reason;
        if (valid) {
          this.dnssecAvailable = dnssecAvailable;
          // DNSSEC is pre-selected by default when available.
          this.options.dnssec = dnssecAvailable;
        }
      })
      .finally(() => {
        if (requestId === this.checkRequestId) {
          this.isLoading = false;
        }
      });
  }

  resetOptions() {
    this.dnssecAvailable = false;
    this.options = {
      anycast: false,
      dnssec: false,
    };
  }

  buildExpressOrderProducts() {
    const configuration = [
      {
        label: CONFIGURATION_LABELS.ZONE,
        value: this.configuration.zone,
      },
      {
        label: CONFIGURATION_LABELS.TEMPLATE,
        value: this.configuration.template,
      },
    ];

    if (this.dnssecAvailable && this.options.dnssec) {
      configuration.push({
        label: CONFIGURATION_LABELS.DNSSEC,
        value: 'true',
      });
    }

    const product = {
      planCode: ZONE_PLAN_CODE,
      productId: DNS_PRODUCT_ID,
      duration: DEFAULT_DURATION,
      pricingMode: DEFAULT_PRICING_MODE,
      quantity: 1,
      configuration,
    };

    if (this.options.anycast) {
      product.option = [
        {
          planCode: ANYCAST_PLAN_CODE,
          duration: DEFAULT_DURATION,
          pricingMode: DEFAULT_PRICING_MODE,
          quantity: 1,
        },
      ];
    }

    return [product];
  }

  order() {
    this.atInternet.trackClick(TRACKING.ORDER);
    const products = this.buildExpressOrderProducts();
    return this.$window.open(
      `${this.expressOrderUrl}?products=${JSURL.stringify(products)}`,
      '_blank',
      'noopener',
    );
  }
}
