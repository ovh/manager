import angular from 'angular';
import get from 'lodash/get';
import pull from 'lodash/pull';

export default class {
  /* @ngInject */
  constructor(
    $q, $stateParams, $timeout, $uibModalInstance,
    OvhApiSms, TucSmsMediator, service, senders, index, option, TucToastError,
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
    this.senders = senders;
    this.index = index;
    this.option = option;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = {
      init: false,
      editTrackingOption: false,
    };
    this.edited = false;
    this.model = {
      service: angular.copy(this.service),
      senders: angular.copy(this.senders),
      index: this.index,
      option: angular.copy(this.option),
    };
    this.availableTrackingMedia = [];
    this.trackingOptions = {};
    this.trackingSender = {};
    this.targetNumberPattern = /^\+?[\d+]{8,14}$/;

    this.loading.init = true;
    return this.TucSmsMediator.initDeferred.promise
      .then(() => this.TucSmsMediator.getApiScheme().then((schema) => {
        this.availableTrackingMedia = pull(schema.models['sms.ResponseTrackingMediaEnum'].enum, 'voice');
        this.trackingOptions.media = this.model.option.media;
        this.trackingSender.sender = this.model.option.sender;
      })).catch((err) => {
        this.TucToastError(err);
      }).finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Edit sms tesponse tracking options.
   * @return {Promise}
   */
  edit() {
    this.model.service.smsResponse.trackingOptions[this.model.index] = {
      media: this.trackingOptions.media,
      sender: this.trackingOptions.media === 'sms' ? get(this.trackingSender.sender, 'sender') : this.model.option.sender,
      target: this.model.option.target,
    };
    this.loading.editTrackingOption = true;
    return this.api.sms.edit({
      serviceName: this.$stateParams.serviceName,
    }, {
      smsResponse: {
        trackingOptions: this.model.service.smsResponse.trackingOptions,
        responseType: this.model.service.smsResponse.responseType,
      },
    }).$promise
      .then(() => {
        this.loading.editTrackingOption = false;
        this.edited = true;
        return this.$timeout(() => this.close(), 1000);
      }).catch(error => this.cancel({
        type: 'API',
        msg: error,
      }));
  }

  /**
   * Reset tracking options.
   */
  resetTrackingOptions() {
    this.trackingSender.sender = null;
    this.model.option.sender = '';
    this.model.option.target = '';
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
