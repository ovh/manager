import get from 'lodash/get';

import { BillingService } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor($translate, atInternet, Alerter) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
  }

  $onInit() {
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
      event: 'autorenew::validate-config',
      page: 'dedicated::account::billing::autorenew::validate-config',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });
  }

  onFinish() {
    this.atInternet.trackClick({
      name: 'autorenew::validate-config',
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });
  }
}
