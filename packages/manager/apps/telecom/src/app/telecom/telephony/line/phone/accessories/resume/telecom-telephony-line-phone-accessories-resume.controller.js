import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';

angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyLinePhoneAccessoriesResumeCtrl',
    function TelecomTelephonyLinePhoneAccessoriesResumeCtrl(
      $q,
      TucTelephonyAccessoriesOrderProcess,
    ) {
      const self = this;

      self.process = null;
      self.order = null;
      self.error = null;
      self.model = {
        contracts: false,
        retract: null,
      };
      self.loading = {
        init: false,
      };

      /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

      function init() {
        self.loading.init = true;
        self.process = TucTelephonyAccessoriesOrderProcess.getOrderProcess();

        return TucTelephonyAccessoriesOrderProcess.getOrderCheckout()
          .then(
            (order) => {
              remove(
                order.details,
                (detail) =>
                  ['SPECIAL', 'MUTE'].indexOf(detail.detailType) > -1 ||
                  (isEqual(detail.detailType, 'DELIVERY') &&
                    detail.totalPrice.value === 0),
              );

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
