import assign from 'lodash/assign';
import result from 'lodash/result';
import set from 'lodash/set';
import template from './update/telecom-sms-options-recredit-update.html';
import controller from './update/telecom-sms-options-recredit-update.controller';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    $uibModal,
    OvhApiOrderSms,
    TucSmsMediator,
    TucToast,
    TucToastError,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.api = {
      orderSms: OvhApiOrderSms.v6(),
    };
    this.TucSmsMediator = TucSmsMediator;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = {
      init: false,
      price: false,
    };
    this.service = null;

    this.loading.init = true;
    return this.TucSmsMediator.initDeferred.promise
      .then(() => {
        this.service = this.TucSmsMediator.getCurrentSmsService();
        return this.service;
      })
      .then((service) => this.fetchOfferPrice(service))
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Fetch offer price.
   * @param  {Ojbect} service TucSmsService
   * @return {Promise}
   */
  fetchOfferPrice(service) {
    if (service.automaticRecreditAmount !== null) {
      return this.api.orderSms
        .getCredits({
          serviceName: this.$stateParams.serviceName,
          quantity: service.automaticRecreditAmount,
        })
        .$promise.then((credits) => result(credits, 'prices.withoutTax'))
        .then((price) => assign(service, { price }));
    }
    set(service, 'price', null);
    return this.$q.when(service);
  }

  /**
   * Opens a modal to manage sms recredit options.
   * @param  {Object} service TucSmsService
   */
  update(service) {
    const modal = this.$uibModal.open({
      animation: true,
      template,
      controller,
      controllerAs: 'OptionsRecreditUpdateCtrl',
      resolve: { service: () => service },
    });
    modal.result
      .then(() => {
        this.loading.price = true;
        return this.fetchOfferPrice(this.service).finally(() => {
          this.loading.price = false;
        });
      })
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_options_recredit_update_ko', {
              error: error.message,
            }),
          );
        }
      });
  }
}
