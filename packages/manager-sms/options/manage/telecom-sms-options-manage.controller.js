angular.module('managerApp').controller('TelecomSmsOptionsManageCtrl', class TelecomSmsOptionsManageCtrl {
  constructor($uibModal, TucSmsMediator, TucToastError) {
    this.$uibModal = $uibModal;
    this.TucSmsMediator = TucSmsMediator;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = {
      init: false,
    };
    this.service = null;

    this.loading.init = true;
    return this.TucSmsMediator.initDeferred.promise.then(() => {
      this.service = this.TucSmsMediator.getCurrentSmsService();
    }).catch((err) => {
      this.TucToastError(err);
    }).finally(() => {
      this.loading.init = false;
    });
  }

  /**
     * Opens a modal to manage sms' options.
     * @param  {Object} service TucSmsService.
     */
  update(service) {
    this.$uibModal.open({
      animation: true,
      templateUrl: 'app/telecom/sms/options/manage/update/telecom-sms-options-manage-update.html',
      controller: 'TelecomSmsOptionsManageUpdateCtrl',
      controllerAs: 'OptionsManageUpdateCtrl',
      resolve: { service: () => service },
    });
  }
});
