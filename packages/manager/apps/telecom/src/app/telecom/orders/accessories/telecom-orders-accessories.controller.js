angular.module('managerApp').controller('TelecomOrdersAccessoriesCtrl', function ($q, $state, $translate, OvhApiOrder, OvhApiTelephony, TucToast) {
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

  self.orderAccessories = function () {
    self.loading.submit = true;
    self.orderError = null;

    return OvhApiTelephony.Line().v6().query({
      billingAccount: self.model.billingAccount.billingAccount,
    }).$promise.then((lines) => {
      if (lines.length) {
        return $state.go('telecom.telephony.line.phone.accessories', {
          billingAccount: self.model.billingAccount.billingAccount,
          serviceName: lines[0],
        }, {
          reload: true,
        });
      }
      return $q.reject(true);
    }).catch((err) => {
      self.orderError = err;
    }).finally(() => {
      self.loading.submit = false;
    });
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.loading.init = true;

    return OvhApiOrder.Telephony().Aapi().billingAccounts().$promise.then((billingAccounts) => {
      self.billingAccounts = billingAccounts;
      _.forEach(self.billingAccounts, (elt) => {
        _.set(elt, 'label', elt.description || elt.billingAccount);
      });
      return self.billingAccounts;
    }, (error) => {
      TucToast.error([$translate.instant('telecom_orders_accessories_group_load_error'), (error.data && error.data.message) || ''].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
