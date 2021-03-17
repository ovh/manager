import get from 'lodash/get';
import kebabCase from 'lodash/kebabCase';

import { BillingService } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor($translate, atInternet, Alerter) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.currentRenew = { ...this.service.renew };
    this.billingService = new BillingService(this.service);

    this.model = {
      agreements: this.autorenewAgreements.length === 0,
    };
  }

  switchStep() {
    this.displayConfirmation = !this.displayConfirmation;
  }

  update() {
    this.isUpdating = true;
    return this.updateRenew(this.billingService, this.autorenewAgreements)
      .then(() =>
        this.goBack(
          this.$translate.instant('billing_autorenew_service_update_success'),
        ),
      )
      .catch((error) =>
        this.Alerter.set(
          'alert-danger',
          this.$translate.instant('billing_autorenew_service_update_error', {
            message: get(error, 'data.message'),
          }),
        ),
      )
      .finally(() => {
        this.isUpdating = false;
      });
  }

  onConfirmation() {
    this.atInternet.trackEvent({
      event: `autorenew::${kebabCase(
        this.service.serviceType,
      )}::validate-config`,
      page: `dedicated::account::billing::autorenew::${kebabCase(
        this.service.serviceType,
      )}::validate-config`,
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });
  }

  onFinish() {
    const previousType = this.currentRenew.automatic ? 'auto' : 'manual';
    const previousPeriod = this.currentRenew.period
      ? `_${this.currentRenew.period}m`
      : '';
    const type = this.service.renew.automatic ? 'auto' : 'manual';
    const period = this.service.renew.period
      ? `_${this.service.renew.period}m`
      : '';
    this.atInternet.trackClick({
      name: `autorenew::${kebabCase(
        this.service.serviceType,
      )}::update::from_${previousType}${previousPeriod}_to_${type}${period}`,
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });
  }
}
