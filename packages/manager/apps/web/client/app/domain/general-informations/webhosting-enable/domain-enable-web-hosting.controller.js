import findKey from 'lodash/findKey';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import reduce from 'lodash/reduce';

import { DNS_ZONE_CONFIGURATION } from './constants';

export default class EnableWebHostingOrderCtrl {
  /* @ngInject */
  constructor($translate, Alerter, HOSTING_ORDER_URL) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.HOSTING_ORDER_URL = HOSTING_ORDER_URL;
  }

  $onInit() {
    this.hostingUrl = this.HOSTING_ORDER_URL[this.user.ovhSubsidiary];

    [this.offer] = this.start10mOffers;

    this.dnsConfiguration = {
      A: false,
      MX: false,
    };

    this.configuration = {
      dns_zone: findKey(DNS_ZONE_CONFIGURATION, (configuration) =>
        isEmpty(configuration),
      ),
    };

    this.item = null;
    this.contractsValidated = false;
  }

  getPricings() {
    this.pricings = this.offer.prices.filter(
      ({ maximumRepeat }) => !maximumRepeat,
    );
    [this.price] = this.pricings;
  }

  loadCheckout() {
    const offer = {
      ...this.offer,
      ...this.price,
    };
    this.isLoadingCheckout = true;
    return this.addOption(this.item, offer, this.configuration)
      .then(({ item }) => {
        this.item = item;
        return this.getCheckout();
      })
      .then((checkout) => {
        this.checkout = checkout;
      })
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant(
            'domain_configuration_enable_web_hosting_checkout_error',
            {
              message: get(error, 'data.message', error.message),
            },
          ),
        ),
      )
      .finally(() => {
        this.isLoadingCheckout = false;
      });
  }

  updateConfiguration() {
    const configuration = reduce(
      this.dnsConfiguration,
      (acc, value, config) => (value ? [...acc, config] : acc),
      [],
    );
    this.configuration.dns_zone = findKey(
      DNS_ZONE_CONFIGURATION,
      (dnsConfiguration) => isEqual(configuration, dnsConfiguration),
    );
  }

  activateHosting() {
    this.isLoadingCheckout = true;
    return this.order()
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'domain_configuration_enable_web_hosting_success',
          ),
        ),
      )
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant(
            'domain_configuration_enable_web_hosting_checkout_error',
            {
              message: get(error, 'data.message', error.message),
            },
          ),
        ),
      )
      .finally(() => {
        this.isLoadingCheckout = false;
      });
  }
}
