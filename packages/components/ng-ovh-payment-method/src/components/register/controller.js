import isFunction from 'lodash/isFunction';

export default class OvhPaymentMethodRegisterCtrl {
  onRegisterComponentInitialized(componentInstance) {
    // if it's a function reference ...
    // otherwise the call will be made passing an Object Literal
    // when testing if the callback function is a function ref or not
    if (isFunction(this.onInit({ componentInstance }))) {
      // ... invoke it
      this.onInit()(componentInstance);
    }
  }
}
