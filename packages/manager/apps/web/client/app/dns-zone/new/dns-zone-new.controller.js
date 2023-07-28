import get from 'lodash/get';
import map from 'lodash/map';

import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { WORKFLOW_OPTIONS } from './dns-zone-new.constants';
import { TEMPLATES } from '../../domain/zone/activate/activate.constants';

export default class newDnsZoneCtrl {
  /* @ngInject */
  constructor(
    $anchorScroll,
    $location,
    $translate,
    atInternet,
    Alerter,
    constants,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.$location = $location;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
    this.URLS = constants.urls;

    this.TEMPLATES = TEMPLATES;
  }

  $onInit() {
    this.zoneNameisValid = false;
    this.GUIDE_URL = get(
      this.URLS,
      `${this.user.ovhSubsidiary}.guides.dnsForExternalDomain`,
    );
    this.configuration = {
      zone: null,
      template: this.TEMPLATES.BASIC,
    };
    this.alerts = {
      main: 'newdnszone.alerts.main',
    };

    this.WORKFLOW_OPTIONS = {
      ...WORKFLOW_OPTIONS,
      getPlanCode: () => WORKFLOW_OPTIONS.planCode,
      catalog: this.catalog,
      onGetConfiguration: () => this.getConfiguration(),
    };

    this.WORKFLOW_TYPE = workflowConstants.WORKFLOW_TYPES.ORDER;
    this.PRICING_TYPE = pricingConstants.PRICING_CAPACITIES.RENEW;
  }

  checkZoneName() {
    this.isLoading = true;
    this.zoneNameisValid = false;
    return this.isZoneValid(this.configuration.zone)
      .then((valid) => {
        this.zoneNameisValid = valid;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  static getAlerterId(alerter) {
    return alerter.replaceAll('.', '_');
  }

  getConfiguration() {
    return map(this.configuration, (value, label) => ({
      label,
      value,
    }));
  }

  onDnsOrderSuccess() {
    this.atInternet.trackClick({
      name: 'web::dns-zone-new::activate',
      type: 'action',
    });
    return this.goBack(
      this.$translate.instant('domains_newdnszone_order_success'),
    );
  }

  onDnsOrderError(error) {
    const message = error?.data?.message || error.message;
    this.$location.hash(newDnsZoneCtrl.getAlerterId(this.alerts.main));
    this.$anchorScroll();
    return this.Alerter.error(
      this.$translate.instant('domains_newdnszone_order_error', {
        message,
      }),
      this.alerts.main,
    );
  }
}
