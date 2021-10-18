import {
  chunk,
  find,
  get,
  has,
  isFunction,
  isNil,
  isObject,
  map,
  set,
  some,
} from 'lodash-es';

import {
  DEFAULT_DISPLAY_PER_LINE,
  DEFAULT_ORDERED_PAYMENT_METHOD_TYPES,
  DEFAULT_SELECTED_PAYMENT_METHOD_TYPE,
  FALLBACK_IMAGES,
} from './constants';

export default class OvhPaymentMethodRegisterCtrl {
  /* @ngInject */
  constructor(ovhPaymentMethod, ovhPaymentMethodHelper) {
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.ovhPaymentMethodHelper = ovhPaymentMethodHelper;

    // other attributes used in view
    this.loading = {
      init: false,
    };

    this.availablePaymentMethodTypes = {
      list: null,
      chunks: null,
    };
  }

  /* =====================================
  =            Initialization            =
  ====================================== */

  initAndCheckDefaultBinding() {
    if (isNil(this.model) || !isObject(this.model)) {
      this.model = {};
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

  /* -----  End of Initialization  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.initAndCheckDefaultBinding();

    this.loading.init = true;

    return this.ovhPaymentMethod
      .getAllAvailablePaymentMethodTypes()
      .then((paymentMethodsTypes) => {
        // sort available payment method types with the paymentMethodTypesOrder binding
        this.availablePaymentMethodTypes.list = paymentMethodsTypes.sort(
          (typeA, typeB) => {
            const typeAIndex = this.paymentMethodTypesOrder.indexOf(
              typeA.paymentType,
            );
            const typeBIndex = this.paymentMethodTypesOrder.indexOf(
              typeB.paymentType,
            );
            return typeAIndex > typeBIndex;
          },
        );

        // add a fallback image in case of no image provided by API (for legacies payment methods)
        this.availablePaymentMethodTypes.list = map(
          this.availablePaymentMethodTypes.list,
          (paymentTypeParam) => {
            const paymentType = paymentTypeParam;
            if (!get(paymentType, 'icon.data')) {
              set(
                paymentType,
                'icon.data',
                get(FALLBACK_IMAGES, paymentType.paymentType),
              );
            }
            return paymentType;
          },
        );

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
        if (
          !has(this.model, 'selectedPaymentMethodType') ||
          isNil(this.model.selectedPaymentMethodType)
        ) {
          this.model.selectedPaymentMethodType = defaultPaymentMethodType;
        } else if (this.model.selectedPaymentMethodType) {
          // if the selected payment method type does not exist
          // set the default one
          const isModelTypeExists = some(
            this.availablePaymentMethodTypes.list,
            {
              paymentType: get(
                this.model.selectedPaymentMethodType,
                'paymentType',
              ),
            },
          );

          if (!isModelTypeExists) {
            this.model.selectedPaymentMethodType = defaultPaymentMethodType;
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
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of Hooks  ------ */
}
