import find from 'lodash/find';
import head from 'lodash/head';
import remove from 'lodash/remove';
import { RENEWAL_TYPES } from './form.constants';

export default class {
  /* @ngInject */
  constructor($translate, BillingAutorenewUpdateForm) {
    this.$translate = $translate;
    this.BillingAutorenewUpdateForm = BillingAutorenewUpdateForm;
  }

  $onInit() {
    this.BillingAutorenewUpdateForm.getAvailableRenewPeriods(this.service).then(
      (periods) => {
        this.PERIODS = periods;
        this.RENEWAL_TYPES = this.BillingAutorenewUpdateForm.getRenewalTypes();
        this.model = {
          renewalType:
            find(this.RENEWAL_TYPES, { type: this.service.getRenew() }) ||
            head(this.RENEWAL_TYPES),
          period:
            find(this.PERIODS, { period: this.service.renew.period }) ||
            head(this.PERIODS),
        };
      },
    );

    if (this.service.getRenew() === RENEWAL_TYPES.MANUAL) {
      remove(this.RENEWAL_TYPES, { type: RENEWAL_TYPES.MANUAL });
      this.service.setAutomaticRenew();
    }
  }

  onRenewalTypeChange(renewalType) {
    if (renewalType.type === RENEWAL_TYPES.AUTOMATIC) {
      this.service.setAutomaticRenew(this.model.period.period);
    } else {
      this.service.setManualRenew();
    }
  }

  onPeriodChange(period) {
    this.service.setRenewPeriod(period.period);
  }
}
