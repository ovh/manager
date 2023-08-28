import angular from 'angular';
import remove from 'lodash/remove';
import isEqual from 'lodash/isEqual';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $timeout,
    $uibModalInstance,
    OvhApiSms,
    TucSmsMediator,
    service,
    index,
    option,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: OvhApiSms.v6(),
    };
    this.TucSmsMediator = TucSmsMediator;
    this.service = service;
    this.index = index;
    this.option = option;
  }

  $onInit() {
    this.loading = {
      removeTrackingOption: false,
    };
    this.removed = false;
    this.model = {
      service: angular.copy(this.service),
      index: this.index,
      option: this.option,
    };
  }

  /**
   * Remove sms response tracking options.
   * @return {Promise}
   */
  remove() {
    this.loading.removeTrackingOption = true;
    remove(this.model.service.smsResponse.trackingOptions, (value) =>
      isEqual(value, this.model.option),
    );
    return this.$q
      .all([
        this.api.sms.edit(
          {
            serviceName: this.$stateParams.serviceName,
          },
          {
            smsResponse: {
              trackingOptions: this.model.service.smsResponse.trackingOptions,
              responseType: this.model.service.smsResponse.responseType,
            },
          },
        ).$promise,
        this.$timeout(angular.noop, 1000),
      ])
      .then(() => {
        this.loading.removeTrackingOption = false;
        this.removed = true;
        return this.$timeout(() => this.close(), 1000);
      })
      .catch((error) =>
        this.cancel({
          type: 'API',
          msg: error,
        }),
      );
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
