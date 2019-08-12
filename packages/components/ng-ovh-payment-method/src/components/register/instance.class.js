export default class RegisterInstance {
  constructor(instanceConfiguration) {
    this.configuration = instanceConfiguration;

    this.instanciated = false;
    this.submittedPaymentMethod = null;
    this.submitPromiseCallbacks = {
      resolve: null,
      reject: null,
    };
  }

  submit(paymentMethod) {
    // store submitted payment method
    this.submittedPaymentMethod = paymentMethod;

    // return a Promise
    return new Promise((resolve, reject) => {
      // define resolve and reject of the promise to use these callbacks
      // in Vantive iFrame configuration callback
      this.submitPromiseCallbacks.resolve = resolve;
      this.submitPromiseCallbacks.reject = reject;
    });
  }

  instanciate() {
    this.instanciated = true;
  }
}
