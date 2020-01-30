import angular from 'angular';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $timeout,
    $uibModalInstance,
    OvhApiSms,
    TucSmsMediator,
    receiver,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        receivers: OvhApiSms.Receivers().v6(),
      },
    };
    this.TucSmsMediator = TucSmsMediator;
    this.receiver = receiver;
  }

  $onInit() {
    this.loading = {
      init: false,
      clean: false,
    };
    this.cleaned = false;
    this.receiver = angular.copy(this.receiver);
    this.clean = {
      choice: 'freemium',
      price: this.receiver.records * 0.1, //  0.1 credit per receiver
    };
  }

  /**
   * Clean receivers' list.
   * @return {Promise}
   */
  cleanReceivers() {
    this.loading.clean = true;
    return this.$q
      .all([
        this.api.sms.receivers.clean(
          {
            serviceName: this.$stateParams.serviceName,
            slotId: this.receiver.slotId,
          },
          {
            freemium: this.clean.choice === 'freemium',
            priceOnly: false,
          },
        ).$promise,
        this.$timeout(angular.noop, 1000),
      ])
      .then((results) => {
        this.loading.clean = false;
        this.cleaned = true;
        this.$timeout(
          () =>
            this.close({
              taskId: results[0].taskId,
            }),
          1000,
        );
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

  close(task) {
    return this.$uibModalInstance.close(task || true);
  }
}
