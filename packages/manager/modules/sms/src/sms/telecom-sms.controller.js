import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $scope,
    $translate,
    isSmppAccount,
    TucSmsMediator,
    TucToast,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$scope = $scope;
    this.isSmppAccount = isSmppAccount;
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
    this.TucSmsMediator.initDeferred.promise
      .then(() => {
        this.service = this.TucSmsMediator.getCurrentSmsService();
        this.serviceNameSave = this.updateServiceNameSave.bind(this);
        if (this.isSmppAccount) {
          this.serviceNameAppendix = this.$translate.instant(
            `sms_smpp_channel_qualification_${this.service.channel}`,
          );
        }
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'sms_loading_error',
            this.$stateParams.serviceNameSave,
          )} ${get(error, 'data.message', '')}`,
        );
      })
      .finally(() => {
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
    return this.service
      .save()
      .then(() => {
        this.service.stopEdition();
        this.$scope.$emit(
          'sms_updateName',
          this.service.name,
          this.service.getDisplayedName(),
        );
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'sms_rename_error',
            this.$stateParams.serviceNameSave,
          )} ${get(error, 'data.message', '')}`,
        );
        this.service.stopEdition(true);
        return this.$q.reject(error);
      });
  }
}
