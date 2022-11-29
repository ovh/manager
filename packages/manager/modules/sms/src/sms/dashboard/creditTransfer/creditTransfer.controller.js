export default class SmsCreditTransferCtrl {
  /* @ngInject */
  constructor($translate, SmsService) {
    this.$translate = $translate;
    this.smsService = SmsService;
  }

  $onInit() {
    this.loading = true;
    this.model = {
      serviceName: null,
      smsAccountTarget: null,
      credits: null,
    };
    this.maxCredit = null;

    return this.smsService
      .getAccountList()
      .then((accounts) => {
        this.accountsList = accounts.map((account) => ({
          ...account,
          displayName:
            account.description !== ''
              ? `${account.name} (${account.description})`
              : account.name,
        }));

        this.model.serviceName = this.accountsList.find(
          (account) => account.name === this.serviceName,
        );
        this.onSourceAccountChange(this.model.serviceName);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onSourceAccountChange(modelValue) {
    this.withoutSourceAccount = this.accountsList.filter(
      (account) => account.name !== modelValue.name,
    );
    this.maxCredit = modelValue.creditsLeft;
  }

  onSubmit() {
    this.submitting = true;

    const params = {
      smsAccountTarget: this.model.smsAccountTarget.name,
      credits: this.model.credits,
    };

    return this.smsService
      .postCreditTransfer(this.model.serviceName.name, params)
      .then(() =>
        this.goToDashboard(
          this.$translate.instant('sms_creditTransfer_message_success'),
        ),
      )
      .catch(() =>
        this.goToDashboard(
          this.$translate.instant('sms_creditTransfer_message_error'),
          'danger',
        ),
      )
      .finally(() => {
        this.submitting = false;
      });
  }

  onCancel() {
    return this.goToDashboard();
  }
}
