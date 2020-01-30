import angular from 'angular';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $timeout,
    $uibModalInstance,
    OvhApiSms,
    outgoingSms,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        outgoing: OvhApiSms.Outgoing().v6(),
      },
    };
    this.outgoingSms = outgoingSms;
  }

  $onInit() {
    this.loading = {
      removeOutgoing: false,
    };
    this.removed = false;
    this.model = {
      outgoingSms: angular.copy(this.outgoingSms),
    };
  }

  /**
   * Remove outgoing sms.
   * @return {Promise}
   */
  remove() {
    this.loading.removeOutgoing = true;
    return this.$q
      .all([
        this.api.sms.outgoing.delete({
          serviceName: this.$stateParams.serviceName,
          id: this.model.outgoingSms.id,
        }).$promise,
        this.$timeout(angular.noop, 1000),
      ])
      .then(() => {
        this.loading.removeOutgoing = false;
        this.removed = true;
        return this.$timeout(() => this.close(), 1500);
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
