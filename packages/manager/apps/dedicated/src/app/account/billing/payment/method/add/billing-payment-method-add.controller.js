import _ from 'lodash';

import { CREDITCARD_FOOTPRINT_AMOUNT } from './billing-payment-method-add.constants';

export default class BillingPaymentMethodAddCtrl {
  /* @ngInject */

  constructor($q, $state, $stateParams, $translate, $window, Alerter, billingPaymentMethodSection,
    coreConfig, currentUser, ovhContacts, ovhPaymentMethod) {
    // dependencies injections
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.billingPaymentMethodSection = billingPaymentMethodSection;
    this.coreConfig = coreConfig;
    this.currentUser = currentUser; // from app route resolve
    this.ovhContacts = ovhContacts;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes used in view
    this.loading = {
      init: false,
      add: false,
      paymentMethodTypes: false,
    };

    this.addSteps = {
      paymentMethodType: {
        name: 'paymentMethodType',
        isVisible: () => true,
        isLastStep: () => {
          const isLegacy = _.has(this.model.selectedPaymentMethodType, 'original');
          const isLegacyBankAccount = _.get(
            this.model.selectedPaymentMethodType,
            'original.value',
          ) === 'bankAccount';
          const isInContextRegister = this.ovhPaymentMethod
            .isPaymentMethodTypeRegisterableInContext(this.model.selectedPaymentMethodType);

          return isLegacy && !isLegacyBankAccount && !isInContextRegister;
        },
      },
      legacyBankAccount: {
        name: 'legacyBankAccount',
        position: 2,
        isVisible: () => _.get(
          this.model.selectedPaymentMethodType,
          'original.value',
        ) === 'bankAccount',
        isLastStep: () => false,
      },
      legacyBankAccountOwner: {
        name: 'legacyBankAccountOwner',
        position: 3,
        isVisible: () => _.get(
          this.model.selectedPaymentMethodType,
          'original.value',
        ) === 'bankAccount',
        isLastStep: () => true,
      },
      paymentMethod: {
        name: 'paymentMethod',
        position: 3,
        isVisible: () => this.ovhPaymentMethod
          .isPaymentMethodTypeRegisterableInContext(this.model.selectedPaymentMethodType),
        isLastStep: () => true,
        onFocus: () => {
          if (!this.registerInstance) {
            throw new Error(`You must create a new register instance for '${this.model.selectedPaymentMethodType.integration}' payment method integration.`);
          }

          if (!this.registerInstance.instanciated) {
            this.registerInstance.instanciate();
          }
        },
      },
    };

    this.model = null;
    this.chunkedPaymentMethodTypes = null;
    this.chunkSize = 3;
    this.addAlertMessage = {
      message: null,
      type: null,
    };

    this.bankAccountFootprintAmount = CREDITCARD_FOOTPRINT_AMOUNT;
    this.registerInstance = null;
  }

  /* ----------  Helpers  ---------- */

  getLegacyAddParams() {
    if (_.get(this.model.selectedPaymentMethodType, 'original.value') === 'bankAccount') {
      return {
        iban: _.get(this.$state.current, 'sharedModel.legacyBankAccount.iban'),
        bic: _.get(this.$state.current, 'sharedModel.legacyBankAccount.bic'),
        ownerName: _.get(this.$state.current, 'sharedModel.legacyBillingAddress.ownerName'),
        ownerAddress: _.get(this.$state.current, 'sharedModel.legacyBillingAddress.ownerAddress'),
      };
    }

    return {};
  }

  manageLegacyResponse(result) {
    if (_.get(this.model.selectedPaymentMethodType, 'original.value') !== 'bankAccount') {
      if (this.coreConfig.getRegion() !== 'US') {
        // display a message to tell that a new tab have been opened
        this.addAlertMessage.type = 'info';
        this.addAlertMessage.message = this.$translate.instant('billing_payment_method_add_info', {
          paymentUrl: result.url,
        });
      } else {
        // display a success message
        this.Alerter.success(
          this.$translate.instant('billing_payment_method_add_status_success'),
          'billing_payment_method_add_alert',
        );
      }
    } else {
      // refresh the payment method list so that when returning on parent state,
      // the list is up to date
      this.billingPaymentMethodSection.getPaymentMethods();

      // display a success message
      this.Alerter.success(
        this.$translate.instant('billing_payment_method_add_bank_account_success', {
          t0: result.url,
        }),
        'billing_payment_method_add_alert',
      );
    }
  }

  /* ----------  Events  ---------- */

  onAvailablePaymentMethodsLoadError(error) {
    return this.Alerter.error([
      this.$translate.instant('billing_payment_method_add_load_error'),
      _.get(error, 'data.message', ''),
    ].join(' '), 'billing_payment_method_add_alert');
  }

  onPaymentMethodRegisterInitialized(registerInstance) {
    this.registerInstance = registerInstance;
  }

  onPaymentMethodAddStepperFinish() {
    this.loading.add = true;

    // set default param
    const hasPaymentMethod = this.billingPaymentMethodSection.sharedPaymentMethods.length > 0;
    const isRegisterable = this.ovhPaymentMethod
      .isPaymentMethodTypeRegisterableInContext(this.model.selectedPaymentMethodType);
    let addParams = {
      default: !hasPaymentMethod || this.model.setAsDefault,
    };

    if (this.model.selectedPaymentMethodType.original) {
      addParams = _.merge(addParams, this.getLegacyAddParams());
    }

    if (!this.model.selectedPaymentMethodType.original) {
      const isQueryParamsInHash = this.$window.location.hash.indexOf('?') > 0;
      addParams = _.merge(addParams, {
        register: true,
        callbackUrl: {
          cancel: [this.$window.location.href, 'status=cancel'].join(isQueryParamsInHash ? '&' : '?'),
          error: [this.$window.location.href, 'status=error'].join(isQueryParamsInHash ? '&' : '?'),
          failure: [this.$window.location.href, 'status=failure'].join(isQueryParamsInHash ? '&' : '?'),
          pending: [this.$window.location.href, 'status=pending'].join(isQueryParamsInHash ? '&' : '?'),
          success: [this.$window.location.href, 'status=success'].join(isQueryParamsInHash ? '&' : '?'),
        },
      });
    }

    this.Alerter.resetMessage('billing_payment_method_add_alert');

    return this.ovhPaymentMethod
      .addPaymentMethod(this.model.selectedPaymentMethodType, addParams)
      .then((result) => {
        if (isRegisterable && this.registerInstance) {
          return this.registerInstance.submit(result);
        }

        return this.$q.when(result);
      })
      .then((result) => {
        if (this.model.selectedPaymentMethodType.original) {
          this.manageLegacyResponse(result);
        } else if (isRegisterable) {
          this.Alerter.success(
            this.$translate.instant('billing_payment_method_add_status_success'),
            'billing_payment_method_add_alert',
          );
        }
      })
      .catch((error) => {
        this.Alerter.error([
          this.$translate.instant('billing_payment_method_add_status_error'),
          _.get(error, 'data.message', ''),
        ].join(' '), 'billing_payment_method_add_alert');
      })
      .finally(() => {
        this.loading.add = false;
        this.$onInit();
      });
  }

  /* ----------  Initialization  ---------- */

  resetModel() {
    this.model = {
      selectedPaymentMethodType: _.first(this.paymentMethodTypes),
      setAsDefault: false,
    };
  }

  manageHiPayStatus() {
    if (!this.$stateParams.status) {
      // do nothing if no status in state params
      return;
    }

    const hiPayStatus = this.$stateParams.status;

    if (['cancel', 'pending'].indexOf(hiPayStatus) > -1) {
      this.addAlertMessage.type = 'warning';
    } else if (['error', 'failure'].indexOf(hiPayStatus) > -1) {
      this.addAlertMessage.type = 'error';
    } else {
      this.addAlertMessage.type = 'success';
    }

    this.addAlertMessage.message = this.$translate.instant(`billing_payment_method_add_status_${hiPayStatus}`);
  }

  $onInit() {
    this.loading.init = true;
    this.loading.paymentMethodTypes = true;

    this.manageHiPayStatus();

    return this.billingPaymentMethodSection
      .getPaymentMethods()
      .then(() => {
        this.resetModel();
        this.$state.current.sharedModel = {};
        this.$state.current.sharedSteps = this.addSteps;
      })
      .catch((error) => {
        this.Alerter.error([
          this.$translate.instant('billing_payment_method_add_load_error'),
          _.get(error, 'data.message', ''),
        ].join(' '), 'billing_payment_method_add_alert');
      })
      .finally(() => {
        this.loading.init = false;
      });
  }
}
