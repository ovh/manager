class CloudProjectBillingVoucherAddCtrl {
  constructor(
    $translate,
    $uibModalInstance,
    CucControllerHelper,
    CucCloudMessage,
    OvhApiCloudProjectCredit,
    serviceName,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectCredit = OvhApiCloudProjectCredit;
    this.serviceName = serviceName;

    this.model = {
      value: undefined,
    };
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.OvhApiCloudProjectCredit.v6()
          .save(
            {
              serviceName: this.serviceName,
            },
            {
              code: this.model.value,
            },
          )
          .$promise.then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant('cpb_vouchers_add_success'),
            ),
          )
          .catch((err) =>
            this.CucCloudMessage.error(
              this.$translate.instant('cpb_vouchers_add_error') +
                (err.data && err.data.message ? ` (${err.data.message})` : ''),
            ),
          )
          .finally(() => {
            this.$uibModalInstance.close();
          }),
    });
    return this.saving.load();
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudProjectBillingVoucherAddCtrl',
    CloudProjectBillingVoucherAddCtrl,
  );
