import forEach from 'lodash/forEach';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';

import get from 'lodash/get';
import set from 'lodash/set';
import some from 'lodash/some';

import editModalTemplate from './edit/billing-payment-method-edit.html';
import editModalController from './edit/billing-payment-method-edit.controller';

import defaultModalTemplate from './default/billing-payment-method-default.html';
import defaultModalController from './default/billing-payment-method-default.controller';

import deleteModalTemplate from './delete/billing-payment-method-delete.html';
import deleteModalController from './delete/billing-payment-method-delete.controller';

export default class BillingPaymentMethodCtrl {
  /* @ngInject */

  constructor($q, $translate, $uibModal, Alerter, billingPaymentMethodSection,
    ovhPaymentMethod, User) {
    // dependencies injections
    this.$q = $q;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.billingPaymentMethodSection = billingPaymentMethodSection;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.User = User;

    // other attributes used in views
    this.loading = {
      init: false,
    };

    this.paymentMethods = null;
    this.getPaymentDeferred = this.$q.defer();
    this.tableFilterOptions = null;
    this.guide = null;
    this.hasPendingValidationBankAccount = false;
  }

  isLoading() {
    return this.loading.init || !this.billingPaymentMethodSection.loadDeferredResolved;
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  /**
   *  Open edit payment method modal
   */
  onPaymentMethodEditBtnClick(paymentMethodParam) {
    const paymentMethod = paymentMethodParam;

    const editModal = this.$uibModal.open({
      template: editModalTemplate,
      controller: editModalController,
      controllerAs: '$ctrl',
      resolve: {
        paymentMethodToEdit: paymentMethod,
      },
    });

    return editModal.result.then((data) => {
      if (!angular.isObject(data)) {
        return null;
      }

      paymentMethod.description = data.description;

      this.Alerter.success(
        this.$translate.instant('billing_payment_method_edit_success'),
        'billing_payment_method_alert',
      );

      return data;
    }).catch((error) => {
      if (angular.isString(error)) {
        return null;
      }

      this.Alerter.error([
        this.$translate.instant('billing_payment_method_edit_error'),
        get(error, 'data.message', ''),
      ].join(' '), 'billing_payment_method_alert');

      return error;
    });
  }

  /**
   *  Open confirmation modal to set payment mean as default one
   */
  onSetDefaultPaymentMethodBtnClick(paymentMethod) {
    const modal = this.$uibModal.open({
      template: defaultModalTemplate,
      controller: defaultModalController,
      controllerAs: '$ctrl',
      resolve: {
        paymentMethodToEdit: paymentMethod,
      },
    });

    return modal.result.then((status) => {
      if (status !== 'OK') {
        return null;
      }

      this.billingPaymentMethodSection.sharedPaymentMethods.forEach((methodParam) => {
        const method = methodParam;

        if (method.paymentMethodId === paymentMethod.paymentMethodId) {
          method.default = true;
        } else {
          method.default = false;
        }
      });

      this.Alerter.success(
        this.$translate.instant('billing_payment_method_default_success'),
        'billing_payment_method_alert',
      );

      return paymentMethod;
    }).catch((error) => {
      if (angular.isString(error)) {
        return null;
      }

      this.Alerter.error([
        this.$translate.instant('billing_payment_method_default_error'),
        get(error, 'data.message', ''),
      ].join(' '), 'billing_payment_method_alert');

      return error;
    });
  }

  /**
   *  Open delete confirmation modal
   */
  onPaymentMethodDeleteBtnClick(paymentMethod) {
    const deleteModal = this.$uibModal.open({
      template: deleteModalTemplate,
      controller: deleteModalController,
      controllerAs: '$ctrl',
      resolve: {
        paymentMethodToDelete: paymentMethod,
      },
    });

    return deleteModal.result.then((status) => {
      if (status !== 'OK') {
        return null;
      }

      this.billingPaymentMethodSection.removePaymentMethod(paymentMethod);

      this.Alerter.success(
        this.$translate.instant('billing_payment_method_delete_success'),
        'billing_payment_method_alert',
      );

      return paymentMethod;
    }).catch((error) => {
      if (angular.isString(error)) {
        return null;
      }

      this.Alerter.error([
        this.$translate.instant('billing_payment_method_delete_error'),
        get(error, 'data.message', ''),
      ].join(' '), 'billing_payment_method_alert');

      return error;
    });
  }

  /* -----  End of EVENTS  ------ */

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.init = true;

    return this.$q.all({
      paymentMethods: this.billingPaymentMethodSection.getPaymentMethods(),
      guides: this.User.getUrlOf('guides'),
    }).then(({ paymentMethods, guides }) => {
      // set options for status filter
      this.tableFilterOptions = {
        status: {
          values: {},
        },
        type: {
          values: {},
        },
      };

      forEach(
        map(
          uniqBy(paymentMethods, 'status.value'),
          'status',
        ),
        (status) => {
          set(this.tableFilterOptions.status.values, status.value, status.text);
        },
      );

      forEach(
        map(
          uniqBy(paymentMethods, 'paymentType.value'),
          'paymentType',
        ),
        (paymentType) => {
          set(this.tableFilterOptions.type.values, paymentType.value, paymentType.text);
        },
      );

      // set guide url
      this.guide = get(guides, 'autoRenew', null);

      // set a warn message if a bankAccount is in pendingValidation state
      this.hasPendingValidationBankAccount = some(paymentMethods, method => method.paymentType.value === 'bankAccount' && method.status.value === 'pendingValidation');
    }).catch((error) => {
      this.Alerter.error([
        this.$translate.instant('billing_payment_method_load_error'),
        get(error, 'data.message', ''),
      ].join(' '), 'billing_payment_method_alert');
    }).finally(() => {
      this.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------ */
}

angular
  .module('Billing')
  .controller('BillingPaymentMethodCtrl', BillingPaymentMethodCtrl);
