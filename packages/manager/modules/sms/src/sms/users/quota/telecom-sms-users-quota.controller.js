import angular from 'angular';

export default class {
  /* @ngInject */
  constructor($q, $stateParams, $timeout, $uibModalInstance, OvhApiSms, params) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        users: OvhApiSms.Users().v6(),
      },
    };
    this.user = params.user;
    this.service = params.service;
  }

  $onInit() {
    this.loading = {
      quotaUser: false,
    };
    this.quotaApplied = false;
    this.model = {
      user: angular.copy(this.user),
      service: angular.copy(this.service),
    };
  }

  /**
   * Set sms api user quota.
   * @return {Promise}
   */
  quota() {
    this.loading.quotaUser = true;
    return this.$q.all([
      this.api.sms.users.edit({
        serviceName: this.$stateParams.serviceName,
        login: this.model.user.login,
      }, {
        quotaInformations: {
          quotaLeft: this.model.user.quotaInformations.quotaLeft,
          quotaStatus: this.model.user.quotaInformations.quotaStatus,
        },
      }).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.quotaUser = false;
      this.quotaApplied = true;
      return this.$timeout(() => this.close(), 1000);
    }).catch((error) => this.cancel({
      type: 'API',
      msg: error,
    }));
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }

  /**
   * Has changed helper.
   * @return {Boolean}
   */
  hasChanged() {
    return !(
      this.model.user.quotaInformations.quotaLeft === this.user.quotaInformations.quotaLeft
        && this.model.user.quotaInformations.quotaStatus === this.user
          .quotaInformations.quotaStatus
    );
  }
}
