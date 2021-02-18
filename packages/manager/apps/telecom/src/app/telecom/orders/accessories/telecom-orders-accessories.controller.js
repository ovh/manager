import forEach from 'lodash/forEach';
import set from 'lodash/set';

angular
  .module('managerApp')
  .controller(
    'TelecomOrdersAccessoriesCtrl',
    function TelecomOrdersAccessoriesCtrl(
      $q,
      $state,
      $translate,
      OvhApiOrder,
      OvhApiTelephony,
      TucToast,
    ) {
      const self = this;

      self.billingAccounts = null;
      self.orderError = null;

      self.model = {
        billingAccount: null,
      };

      self.loading = {
        init: false,
        submit: false,
      };

      /*= =============================
  =            EVENTS            =
  ============================== */

      self.orderAccessories = function orderAccessories() {
        self.loading.submit = true;
        self.orderError = null;

        return OvhApiTelephony.Line()
          .v6()
          .query({
            billingAccount: self.model.billingAccount.billingAccount,
          })
          .$promise.then((lines) => {
            if (lines.length) {
              return $state.go(
                'telecom.telephony.billingAccount.line.dashboard.phone.accessories',
                {
                  billingAccount: self.model.billingAccount.billingAccount,
                  serviceName: lines[0],
                },
                {
                  reload: true,
                },
              );
            }
            return $q.reject(true);
          })
          .catch((err) => {
            self.orderError = err;
          })
          .finally(() => {
            self.loading.submit = false;
          });
      };

      /* -----  End of EVENTS  ------*/

      /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

      function init() {
        self.loading.init = true;

        return OvhApiOrder.Telephony()
          .Aapi()
          .billingAccounts()
          .$promise.then(
            (billingAccounts) => {
              self.billingAccounts = billingAccounts;
              forEach(self.billingAccounts, (elt) => {
                set(elt, 'label', elt.description || elt.billingAccount);
              });
              return self.billingAccounts;
            },
            (error) => {
              TucToast.error(
                [
                  $translate.instant(
                    'telecom_orders_accessories_group_load_error',
                  ),
                  (error.data && error.data.message) || '',
                ].join(' '),
              );
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
