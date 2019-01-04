import angular from 'angular';
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import pick from 'lodash/pick';
import result from 'lodash/result';
import sortBy from 'lodash/sortBy';

export default class {
  /* @ngInject */
  constructor(
    $q, $stateParams, $timeout, $uibModalInstance,
    OvhApiOrderSms, OvhApiSms, TucSmsMediator, service, TucToastError,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.api = {
      sms: OvhApiSms.v6(),
      orderSms: OvhApiOrderSms.v6(),
    };
    this.TucSmsMediator = TucSmsMediator;
    this.service = service;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = {
      init: false,
      updateOptions: false,
      price: false,
    };
    this.updated = false;
    this.model = {
      service: angular.copy(this.service),
    };
    this.availablePackQuantity = [];
    this.price = null;
    this.attributs = ['creditThresholdForAutomaticRecredit', 'automaticRecreditAmount'];

    this.loading.init = true;
    return this.TucSmsMediator.initDeferred.promise
      .then(() => this.TucSmsMediator.getApiScheme().then((schema) => {
        this.availablePackQuantity = sortBy(map(schema.models['sms.PackQuantityAutomaticRecreditEnum'].enum, Number));
      })).then(this.getAmount()).catch((err) => {
        this.TucToastError(err);
      }).finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Get amount without tax.
   * @return {Promise}
   */
  getAmount() {
    if (this.model.service.automaticRecreditAmount) {
      this.loading.price = true;
      return this.api.orderSms.getCredits({
        serviceName: this.$stateParams.serviceName,
        quantity: this.model.service.automaticRecreditAmount,
      }).$promise.then((credits) => {
        this.price = result(credits, 'prices.withoutTax');
        return this.price;
      }).finally(() => {
        this.loading.price = false;
      });
    }
    this.price = null;
    return this.$q.when(null);
  }

  /**
   * Set automatic recredit option.
   * @return {Promise}
   */
  setAutomaticRecredit() {
    this.loading.updateOptions = true;
    return this.$q.all([
      this.api.sms.put({
        serviceName: this.$stateParams.serviceName,
      }, pick(this.model.service, this.attributs)).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.loading.updateOptions = false;
      this.updated = true;
      assign(this.service, pick(this.model.service, this.attributs), { price: null });
      return this.$timeout(() => this.close(), 1500);
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

  /**
   * Has changed helper.
   * @return {Boolean}
   */
  hasChanged() {
    return !isEqual(
      pick(this.model.service, this.attributs),
      pick(this.service, this.attributs),
    );
  }
}
