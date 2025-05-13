angular
  .module('services')

  // It creates and manages a single instance of the BillingVantiv
  // object to be able to call the submit method from two different
  // contexts.
  .service(
    'BillingVantivInstance',
    class BillingVantivInstance {
      /* @ngInject */
      constructor(BillingVantiv) {
        this.BillingVantiv = BillingVantiv;
      }

      instanciate(configuration) {
        if (this.instance) {
          throw new Error(
            "An instance already exist for BillingVantiv, you can't create another one until cleared this one.",
          );
        }

        this.instance = new this.BillingVantiv(configuration);
      }

      submit(id) {
        if (!this.instance) {
          throw new Error(
            "The submit method can't be called until the instanciate method has been called.",
          );
        }

        return this.instance.submit(id);
      }

      clear() {
        if (!this.instance) {
          throw new Error(
            "The clear method can't be called until the instanciate method has been called.",
          );
        }

        delete this.instance;
      }
    },
  );
