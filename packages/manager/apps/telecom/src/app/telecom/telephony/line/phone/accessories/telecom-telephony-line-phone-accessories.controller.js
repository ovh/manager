angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyLinePhoneAccessoriesCtrl',
    function TelecomTelephonyLinePhoneAccessoriesCtrl(
      $q,
      $stateParams,
      $translate,
      atInternet,
      TelephonyMediator,
      TucTelephonyAccessoriesOrderProcess,
      TucToast,
    ) {
      const self = this;

      self.process = null;

      self.loading = {
        init: false,
      };

      /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

      function init() {
        self.loading.init = true;

        return TelephonyMediator.getGroup($stateParams.billingAccount)
          .then(
            () => {
              self.process = TucTelephonyAccessoriesOrderProcess.init(
                $stateParams.billingAccount,
              );
            },
            (error) => {
              TucToast.error(
                [
                  $translate.instant(
                    'telephony_line_phone_accessories_load_error',
                  ),
                  (error.data && error.data.message) || '',
                ].join(' '),
              );
              return $q.error(error);
            },
          )
          .finally(() => {
            self.loading.init = false;
            return atInternet.trackPage({
              name: 'accessories-Tel',
              type: 'navigation',
              level2: 'Telecom',
              chapter1: 'telecom',
            });
          });
      }

      /* -----  End of INITIALIZATION  ------*/

      init();
    },
  );
