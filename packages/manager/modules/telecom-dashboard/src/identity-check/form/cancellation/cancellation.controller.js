export default class IdentityCheckFormCancellationCtrl {
  constructor($translate, IdentityCheckService, TucToast) {
    this.$translate = $translate;
    this.IdentityCheckService = IdentityCheckService;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.trackPage('account-validation::cancel-validation-popup');
  }

  confirm() {
    this.trackClick('cancel-validation-popup::confirm');

    return this.IdentityCheckService.cancelProcedure(this.procedureId)
      .then(() => {
        this.trackPage('cancel-account-validation::success');
        return this.goBack(
          this.$translate.instant(
            'telecom_dashboard_identity_check_form_cancel_success',
          ),
          'SUCCESS',
        );
      })
      .catch(({ status }) => {
        this.trackPage(
          `cancel-account-validation::error${status === 409 ? '-order' : ''}`,
        );
        return this.goBack(
          this.$translate.instant(
            `telecom_dashboard_identity_check_form_cancel_error${
              status === 409 ? '_ongoing' : ''
            }`,
          ),
          'DANGER',
        );
      });
  }

  cancel() {
    this.trackClick('cancel-validation-popup::cancel');
    return this.goBack();
  }
}
