angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyLinePhoneAccessoriesFinalizeCtrl',
    function TelecomTelephonyLinePhoneAccessoriesFinalizeCtrl(
      $q,
      TucTelephonyAccessoriesOrderProcess,
    ) {
      const self = this;

      self.process = null;
      self.order = null;
      self.error = null;
      self.loading = {
        init: false,
      };

      /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

      function init() {
        self.loading.init = true;
        self.process = TucTelephonyAccessoriesOrderProcess.getOrderProcess();

        return TucTelephonyAccessoriesOrderProcess.orderCheckout()
          .then(
            (order) => {
              self.order = order;
            },
            (error) => {
              self.error = error;
              return $q.reject(error);
            },
          )
          .finally(() => {
            self.loading.init = false;
          });
      }

      /* -----  End of INITIALIZATION  ------*/

      init();
    },
  );
