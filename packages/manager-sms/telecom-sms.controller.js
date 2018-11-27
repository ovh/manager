import _ from 'lodash';

export default /* @ngInject */ class TelecomSmsCtrl {
  constructor($q, $stateParams, $translate, SidebarMenu, TucSmsMediator, TucToast) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.SidebarMenu = SidebarMenu;
    this.TucSmsMediator = TucSmsMediator;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.loading = {
      init: false,
      save: false,
    };
    this.service = null;

    this.loading.init = true;
    this.TucSmsMediator.initDeferred.promise.then(() => {
      this.service = this.TucSmsMediator.getCurrentSmsService();
      this.serviceNameSave = this.updateServiceNameSave.bind(this);
    }).catch((error) => {
      this.TucToast.error(`${this.$translate.instant('sms_loading_error', this.$stateParams.serviceNameSave)} ${_.get(error, 'data.message', '')}`);
    }).finally(() => {
      this.loading.init = false;
    });
  }

  /**
     * Update service name description.
     * @param  {String} newServiceDescription
     * @return {Promise}
     */
  updateServiceNameSave(newServiceDescription) {
    this.service.startEdition();
    this.service.description = newServiceDescription;
    return this.service.save().then(() => {
      this.service.stopEdition();
      this.SidebarMenu.updateItemDisplay({
        title: this.service.getDisplayedName(),
      }, this.service.name, 'telecom-sms-section');
    }).catch((error) => {
      this.TucToast.error(`${this.$translate.instant('sms_rename_error', this.$stateParams.serviceNameSave)} ${_.get(error, 'data.message', '')}`);
      this.service.stopEdition(true);
      return this.$q.reject(error);
    });
  }
}
