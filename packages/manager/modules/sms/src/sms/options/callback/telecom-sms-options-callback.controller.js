import controller from './update/telecom-sms-options-callback-update.controller';
import template from './update/telecom-sms-options-callback-update.html';

export default class {
  /* @ngInject */
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
    return this.TucSmsMediator.initDeferred.promise
      .then(() => {
        this.service = this.TucSmsMediator.getCurrentSmsService();
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Opens a modal to callback sms' options.
   * @param  {Object} service TucSmsService.
   */
  update(service) {
    this.$uibModal.open({
      animation: true,
      template,
      controller,
      controllerAs: 'OptionsCallbackUpdateCtrl',
      resolve: { service: () => service },
    });
  }
}
