import chunk from 'lodash/chunk';
import find from 'lodash/find';
import isFunction from 'lodash/isFunction';

import {
  DEFAULT_DISPLAY_PER_LINE,
  DEFAULT_ORDERED_PAYMENT_METHOD_TYPES,
  DEFAULT_SELECTED_PAYMENT_METHOD_TYPE,
} from './availableTypes.constants';

export default class OvhPaymentMethodAvailableTypesCtrl {
  /* @ngInject */
  constructor(ovhPaymentMethod) {
    // dependencies injection
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes in view
    this.paymentMethodTypes = {
      list: null,
      chunks: null,
    };

    this.loading = {
      init: false,
    };

    this.model = {
      selectedPaymentMethodType: null,
    };
  }

  /* =============================
  =            Events            =
  ============================== */

  onPaymentMethodChange() {
    const paymentType = find(this.paymentMethodTypes.list, {
      paymentType: {
        value: this.model.selectedPaymentMethodType,
      },
    });

    // if it's a function reference ...
    // otherwise the call will be made passing an Object Literal
    // when testing if the callback function is a function ref or not
    if (isFunction(this.onSelectedPaymentTypeChange({
      paymentType,
    }))) {
      // ... invoke it
      this.onSelectedPaymentTypeChange()(paymentType);
    }
  }

  /* -----  End of Events  ------ */

  /* =====================================
  =            Initialization            =
  ====================================== */

  setDefaultValues() {
    // paymentTypesOrder is an array with default ordered payment types
    if (!this.paymentTypesOrder) {
      this.paymentTypesOrder = DEFAULT_ORDERED_PAYMENT_METHOD_TYPES;
    }

    // paymentTypesPerLine set to DEFAULT_DISPLAY_PER_LINE
    if (!this.paymentTypesPerLine) {
      this.paymentTypesPerLine = DEFAULT_DISPLAY_PER_LINE;
    }

    // set default payment method type selected
    if (!this.defaultPaymentType) {
      this.defaultPaymentType = DEFAULT_SELECTED_PAYMENT_METHOD_TYPE;
    }
  }

  $onInit() {
    this.setDefaultValues();

    this.loading.init = true;

    return this.ovhPaymentMethod
      .getAllAvailablePaymentMethodTypes()
      .then((availableTypesPaymentMethodTypes) => {
        this.paymentMethodTypes.list = availableTypesPaymentMethodTypes.sort((typeA, typeB) => {
          const typeAIndex = this.paymentTypesOrder.indexOf(typeA.paymentType.value);
          const typeBIndex = this.paymentTypesOrder.indexOf(typeB.paymentType.value);
          return typeAIndex > typeBIndex;
        });

        this.paymentMethodTypes.chunks = chunk(
          this.paymentMethodTypes.list,
          this.paymentTypesPerLine,
        );

        // set selected payment method type selection
        this.model.selectedPaymentMethodType = this.defaultPaymentType;
        this.onPaymentMethodChange();

        // if it's a function reference ...
        // otherwise the call will be made passing an Object Literal
        // when testing if the callback function is a function ref or not
        if (isFunction(this.onLoaded({
          availableTypes: this.paymentMethodTypes.list,
        }))) {
          // ... invoke it
          this.onLoaded()(this.paymentMethodTypes.list);
        }
      })
      .catch((error) => {
        // if it's a function reference ...
        // otherwise the call will be made passing an Object Literal
        // when testing if the callback function is a function ref or not
        if (isFunction(this.onLoadError({
          error,
        }))) {
          // ... invoke it
          this.onLoadError()(error);
        }
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of Initialization  ------ */
}
