import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import set from 'lodash/set';

angular.module('managerApp').controller('TelecomOrdersAliasCtrl', function (OvhApiOrder, TucToast, $q, $translate, $state) {
  const self = this;

  /*= =============================
    =            EVENTS            =
    ============================== */

  this.submit = function () {
    return $state.go(
      'telecom.telephony.orderAlias',
      {
        billingAccount: self.billingAccount.billingAccount,
      },
      {
        reload: true,
      },
    );
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading = {
      init: true,
    };

    OvhApiOrder.Telephony().Aapi().billingAccounts().$promise.then(
      (billingAccounts) => {
        self.orderAccounts = filter(billingAccounts, { status: 'enabled' });
        forEach(self.orderAccounts, (elt) => {
          set(elt, 'label', elt.description || elt.billingAccount);
        });
        return self.orderAccounts;
      },
      (err) => {
        TucToast.error($translate.instant('telecom_orders_alias_billing_loading_error'));
        return $q.reject(err);
      },
    ).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
