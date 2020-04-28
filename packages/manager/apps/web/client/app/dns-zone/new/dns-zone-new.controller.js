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
  constructor($translate, Alerter, constants, newDnsZone) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.newDnsZone = newDnsZone;
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

  getConfiguration() {
    return map(this.configuration, (value, label) => ({
      label,
      value,
    }));
  }

  onDnsOrderSuccess() {
    return this.goBack(
      this.$translate.instant('domains_newdnszone_order_success'),
    );
  }

  onDnsOrderError(error) {
    return this.Alerter.error(
      this.$translate.instant('domains_newdnszone_order_error', {
        message: error.message,
      }),
      this.alerts.main,
    );
  }
}
