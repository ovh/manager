import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    Alerter,
    OvhApiMe,
    postalMailOptionsActivated,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.Alerter = Alerter;
    this.OvhApiMe = OvhApiMe;
    this.postalMailOptionsActivated = postalMailOptionsActivated;

    this.loading = {
      update: false,
    };
  }

  confirmChoice() {
    this.loading.update = true;

    this.OvhApiMe.Billing()
      .InvoicesByPostalMail()
      .v6()
      .post({
        enable: this.postalMailOptionsActivated,
      })
      .$promise.then(() => {
        this.Alerter.success(
          this.$translate.instant(
            this.postalMailOptionsActivated
              ? 'billing_main_history_postal_mail_options_activate_success'
              : 'billing_main_history_postal_mail_options_desactivate_success',
          ),
          'billing_main_alert',
        );
        this.$uibModalInstance.close();
      })
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant(
              'billing_main_history_postal_mail_options_update_error',
            ),
            get(error, 'data.message'),
          ].join(' '),
          'billing_main_alert',
        );
        this.$uibModalInstance.dismiss();
      })
      .finally(() => {
        this.loading.update = false;
      });
  }
}
