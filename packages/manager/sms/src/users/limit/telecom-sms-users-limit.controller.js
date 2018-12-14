import angular from 'angular';
import isEmpty from 'lodash/isEmpty';

export default class {
  /* @ngInject */
  constructor(
    $q, $stateParams, $timeout, $uibModalInstance,
    OvhApiMe, OvhApiSms, TucSmsMediator, user, TucToastError,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: {
        users: OvhApiSms.Users().v6(),
      },
      user: OvhApiMe.v6(),
    };
    this.TucSmsMediator = TucSmsMediator;
    this.TucToastError = TucToastError;
    this.user = user;
  }

  $onInit() {
    this.loading = {
      init: false,
      limitUser: false,
    };
    this.limited = false;
    this.model = {
      user: angular.copy(this.user),
    };
    this.enums = {};
    this.limitStatus = null;
    this.numberPattern = /^\+?\d+$/;

    this.loading.init = true;
    return this.$q.all({
      enums: this.fetchEnums(),
      userEmail: this.fetchUserEmail(),
    }).then((result) => {
      this.enums = result.enums;
      this.limitStatus = this.getLimitStatus();
    }).catch((err) => {
      this.TucToastError(err);
    }).finally(() => {
      this.loading.init = false;
    });
  }

  /**
   * Fetch enums.
   * @return {Promise}
   */
  fetchEnums() {
    return this.TucSmsMediator.getApiScheme().then(schema => schema.models['sms.SupportEnum'].enum);
  }

  /**
   * Fetch user email.
   * @return {Promise}
   */
  fetchUserEmail() {
    if (isEmpty(this.user.alertThresholdInformations.alertEmail)) {
      return this.api.user.get().$promise.then((user) => {
        this.model.user.alertThresholdInformations.alertEmail = user.email;
      });
    }
    return this.$q.when(null);
  }

  /**
   * Get limit status.
   * @return {String}
   */
  getLimitStatus() {
    if (this.model.user.alertThresholdInformations.alertThreshold === -1) {
      this.model.user.alertThresholdInformations.limitStatus = 'inactive';
    } else {
      this.model.user.alertThresholdInformations.limitStatus = 'active';
      this.alertThreshold = this.model.user.alertThresholdInformations.alertThreshold;
    }
    return this.model.user.alertThresholdInformations.limitStatus;
  }

  /**
   * Get alert threshold informations.
   * @return {Objet}
   */
  getAlertThresholdInformations() {
    return {
      alertThresholdInformations: {
        alertEmail: this.model.user.alertThresholdInformations.alertEmail,
        alertNumber: this.model.user.alertThresholdInformations.alertNumber,
        alertThreshold: this.model.user.alertThresholdInformations.limitStatus === 'active' ? this.alertThreshold : -1,
        support: this.model.user.alertThresholdInformations.support,
      },
    };
  }

  /**
   * Set sms api user limit.
   * @return {Promise}
   */
  limit() {
    this.loading.limitUser = true;
    return this.$q.all([
      this.api.sms.users.edit({
        serviceName: this.$stateParams.serviceName,
        login: this.model.user.login,
      }, this.getAlertThresholdInformations()).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.limitUser = false;
      this.limited = true;
      return this.$timeout(() => this.close(), 1000);
    }).catch(error => this.cancel({
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

  /* eslint-disable max-len */
  /**
   * Has changed helper.
   * @return {Boolean}
   */
  hasChanged() {
    return !(
      this.model.user.alertThresholdInformations.alertEmail === this.user.alertThresholdInformations.alertEmail
        && this.model.user.alertThresholdInformations.alertNumber === this.user.alertThresholdInformations.alertNumber
        && this.alertThreshold === this.user.alertThresholdInformations.alertThreshold
        && this.model.user.alertThresholdInformations.support === this.user.alertThresholdInformations.support
        && this.model.user.alertThresholdInformations.limitStatus === this.limitStatus
    );
  }
  /* eslint-enable max-len */
}
