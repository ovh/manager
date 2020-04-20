import get from 'lodash/get';

import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

export default class DomainZoneActivateCtrl {
  /* @ngInject */
  constructor($translate, Alerter) {
    this.$translate = $translate;
    this.Alerter = Alerter;

    this.PRICING_TYPE = pricingConstants.PRICING_CAPACITIES.DETACH;
    this.WORKFLOW_TYPE = workflowConstants.WORKFLOW_TYPES.SERVICES;
  }

  $onInit() {
    this.WORKFLOW_OPTIONS = {
      serviceId: this.serviceInfos.serviceId,
      detachPlancodes: this.detachZoneOptions,
    };
  }

  onError(error) {
    return this.Alerter.error(
      this.$translate.instant('web_domain_zone_detach_error', {
        error: get(error, 'data.message', error.message),
      }),
    );
  }

  onSuccess() {
    return this.goBack(
      this.$translate.instant('web_domain_zone_detach_success_autopay'),
    );
  }
}
