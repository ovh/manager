import { chunk, find, get, has, isFunction, isNil, isObject } from 'lodash-es';

import {
  DEFAULT_DISPLAY_PER_LINE,
  DEFAULT_ORDERED_PAYMENT_METHOD_TYPES,
  DEFAULT_SELECTED_PAYMENT_METHOD_TYPE,
  FALLBACK_IMAGES,
  PAYPAL_PAYMENT_METHOD,
  PAYMENTS_RUPAY_MESSAGE_FEATURE,
  CHARGES,
  SEPA_DIRECT_DEBIT_PAYMENT_METHOD,
  SEPA_INFORMATION_MODAL_FEATURE,
} from './constants';

export default class OvhPaymentMethodRegisterCtrl {
  /* @ngInject */
  constructor(
    $q,
    $transclude,
    ovhPaymentMethod,
    ovhPaymentMethodHelper,
    ovhFeatureFlipping,
    coreConfig,
    OVH_PAYMENT_METHOD_INTEGRATION_TYPE,
  ) {
    this.$q = $q;
    this.$transclude = $transclude;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.ovhPaymentMethodHelper = ovhPaymentMethodHelper;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.coreConfig = coreConfig;
    const user = this.coreConfig.getUser();
    this.subsidiary = user.ovhSubsidiary;
    // other attributes used in view
    this.loading = {
      init: false,
    };

    this.availablePaymentMethodTypes = {
      list: null,
      chunks: null,
    };
    this.PAYPAL_PAYMENT_METHOD = PAYPAL_PAYMENT_METHOD;

    this.registrationCharges = `${CHARGES}${user.currency.code}`;

    this.OVH_PAYMENT_METHOD_INTEGRATION_TYPE = OVH_PAYMENT_METHOD_INTEGRATION_TYPE;

    this.filterPaymentMethod = this.filterPaymentMethod.bind(this);
  }

  /* =====================================
  =            Initialization            =
  ====================================== */

  initAndCheckDefaultBinding() {
    if (this.forceSetAsDefaultChoice) {
      this.showSetAsDefaultChoice = true;
    }

    if (isNil(this.model) || !isObject(this.model)) {
      this.model = {};
    }

    if (this.modelName && this.modelName !== 'selectedPaymentMethodType') {
      const { [this.modelName]: model } = this.model;
      delete this.model[this.modelName];
      Object.defineProperty(this.model, this.modelName, {
        get() {
          return this.selectedPaymentMethodType;
        },
        set(value) {
          this.selectedPaymentMethodType = value;
        },
      });
      this.model[this.modelName] = model;
    }

    if (this.required) {
      Object.defineProperty(this.model, 'valid', {
        get: () => this.form.$valid,
      });
    }

    // set an empty list of registered payment methods if not provided
    if (!this.registeredPaymentMethods) {
      this.registeredPaymentMethods = [];
    }

    this.hasDefaultPaymentMethod = this.registeredPaymentMethods.some(
      ({ default: isDefault }) => isDefault === true,
    );

    // paymentMethodTypesOrder is an array with default ordered payment types
    if (!this.paymentMethodTypesOrder) {
      this.paymentMethodTypesOrder = DEFAULT_ORDERED_PAYMENT_METHOD_TYPES;
    }

    // paymentMethodTypesPerLine set to DEFAULT_DISPLAY_PER_LINE
    if (!this.paymentMethodTypesPerLine) {
      this.paymentMethodTypesPerLine = DEFAULT_DISPLAY_PER_LINE;
    }

    // set default payment method type selected
    if (!this.defaultPaymentMethodType) {
      this.defaultPaymentMethodType = DEFAULT_SELECTED_PAYMENT_METHOD_TYPE;
    }
  }

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.initAndCheckDefaultBinding();
    this.isSepaInformationModalOpened = false;
    this.hasAlreadyShownSepaInformationModal = false;

    this.loading.init = true;
    this.$q
      .all([
        this.getAllAvailablePaymentMethodTypes(),
        this.getFeaturesAvailability(),
        this.getSpecificCrossBorderSentenceForCardPayment(),
      ])
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* =====================================
  =            API                       =
  ====================================== */

  getAllAvailablePaymentMethodTypes() {
    return this.ovhPaymentMethod
      .getAllAvailablePaymentMethodTypes()
      .then((paymentMethodsTypes) => {
        this.paymentMethodsTypes = paymentMethodsTypes;
        // sort available payment method types with the paymentMethodTypesOrder binding
        this.availablePaymentMethodTypes.list = paymentMethodsTypes.sort(
          (typeA, typeB) => {
            const typeAIndex = this.paymentMethodTypesOrder.indexOf(
              typeA.paymentType,
            );
            const typeBIndex = this.paymentMethodTypesOrder.indexOf(
              typeB.paymentType,
            );
            return typeAIndex - typeBIndex;
          },
        );

        // add a fallback image in case of no image provided by API (for legacies payment methods)
        this.availablePaymentMethodTypes.list.forEach((paymentMethodType) => {
          const paymentType = paymentMethodType;
          if (!paymentType.icon) {
            paymentType.icon = {};
          }
          paymentType.icon.data =
            paymentType.icon.data || FALLBACK_IMAGES[paymentType.paymentType];
        });

        // Push unregistered payment methods
        if (this.unregisteredPaymentMethods) {
          this.availablePaymentMethodTypes.list = [
            ...this.availablePaymentMethodTypes.list,
            ...this.unregisteredPaymentMethods,
          ];
        }

        // split available payment method types list by chunk of paymentMethodTypesPerLine number
        this.availablePaymentMethodTypes.chunks = chunk(
          this.availablePaymentMethodTypes.list,
          this.paymentMethodTypesPerLine,
        );

        const defaultPaymentMethodType = find(
          this.availablePaymentMethodTypes.list,
          {
            paymentType: this.defaultPaymentMethodType,
            ...(this.defaultPaymentMethodIntegration
              ? { integration: this.defaultPaymentMethodIntegration }
              : {}),
          },
        );

        // set selected payment method type model
        if (this.automaticSelect || this.automaticSelect === undefined) {
          if (
            !has(this.model, 'selectedPaymentMethodType') ||
            isNil(this.model.selectedPaymentMethodType)
          ) {
            this.model.selectedPaymentMethodType = defaultPaymentMethodType;
          } else if (this.model.selectedPaymentMethodType) {
            // if the selected payment method type does not exist
            // set the default one
            const foundModel = find(this.availablePaymentMethodTypes.list, {
              paymentType: get(
                this.model.selectedPaymentMethodType,
                'paymentType',
              ),
            });

            this.model.selectedPaymentMethodType =
              foundModel ?? defaultPaymentMethodType;
          }
        }

        // set default model
        if (
          (!has(this.model, 'setAsDefault') ||
            isNil(this.model.setAsDefault)) &&
          this.automaticDefault
        ) {
          this.model.setAsDefault = this.registeredPaymentMethods.length === 0;
        }

        // call onInitialized callback
        // if it's a function reference ...
        // otherwise the call will be made passing an Object Literal
        // when testing if the callback function is a function ref or not
        if (
          this.onInitialized &&
          isFunction(
            this.onInitialized({
              availablePaymentMethodTypes: this.availablePaymentMethodTypes
                .list,
            }),
          )
        ) {
          // ... invoke it
          this.onInitialized()(this.availablePaymentMethodTypes.list);
        }
      })
      .catch((error) => {
        // call onInitializationError callback
        // if it's a function reference ...
        // otherwise the call will be made passing an Object Literal
        // when testing if the callback function is a function ref or not
        if (
          this.onInitializationError &&
          isFunction(
            this.onInitializationError({
              error,
            }),
          )
        ) {
          // ... invoke it
          this.onInitializationError()(error);
        }
      });
  }

  getFeaturesAvailability() {
    return this.ovhFeatureFlipping
      .checkFeatureAvailability([
        PAYMENTS_RUPAY_MESSAGE_FEATURE,
        SEPA_INFORMATION_MODAL_FEATURE,
      ])
      .then((featureAvailability) => {
        this.showRupayMessage = featureAvailability.isFeatureAvailable(
          PAYMENTS_RUPAY_MESSAGE_FEATURE,
        );
        this.canShowSepaInformationModal = featureAvailability.isFeatureAvailable(
          SEPA_INFORMATION_MODAL_FEATURE,
        );
      });
  }

  getSpecificCrossBorderSentenceForCardPayment() {
    return this.ovhPaymentMethodHelper
      .hasSpecificCrossBorderSentenceForCardPayment()
      .then((hasSpecificCrossBorderSentenceForCardPayment) => {
        // display or not the specific cross border sentence for given subsidiaries
        this.showSpecificCrossBorderSentenceForCardPayment = hasSpecificCrossBorderSentenceForCardPayment;
      });
  }

  /* =====================================
  =            Methods                   =
  ====================================== */

  resetForm() {
    this.model.setAsDefault = false;
  }

  onPaymentMethodTypeChange(type) {
    // We display an information modal (only once per access to the payment method register screen) to customer
    // to make them aware that SEPA payment method require them to have a bank account in the SEPA zone
    if (
      !this.hasAlreadyShownSepaInformationModal &&
      this.canShowSepaInformationModal &&
      type === SEPA_DIRECT_DEBIT_PAYMENT_METHOD
    ) {
      this.isSepaInformationModalOpened = true;
      this.hasAlreadyShownSepaInformationModal = true;
    }
    this.resetForm();
  }

  closeSepaInformationModal() {
    this.isSepaInformationModalOpened = false;
  }

  filterPaymentMethod(paymentMethodType) {
    return !this.excludedPaymentMethods?.includes?.(
      paymentMethodType.paymentType,
    );
  }
}
