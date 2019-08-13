angular.module('managerApp').controller('TelecomTelephonyBillingAccountBillingDepositMovementCtrl', function ($q, $state, $timeout, $translate, OvhApiTelephony, TucToastError, TucToast) {
  const self = this;

  self.loading = {
    init: true,
    submit: false,
    success: false,
  };

  self.sources = [];
  self.source = null;
  self.targets = [];
  self.target = null;
  self.amount = 0;
  self.currency = '';

  function init() {
    self.loading.init = true;

    self.getEnabledBillingAccounts().then((billingAccountsParam) => {
      let billingAccounts = _.map(billingAccountsParam, item => ({
        label: item.description || item.billingAccount,
        value: item,
      }));
      billingAccounts = _.sortBy(billingAccounts, 'label');
      self.sources = billingAccounts;
    }).catch(err => new TucToastError(err)).finally(() => {
      self.loading.init = false;
    });
  }

  self.submit = function () {
    self.loading.submit = true;

    return OvhApiTelephony.v6().transferSecurityDeposit({
      billingAccount: self.source.billingAccount,
    }, {
      amount: self.amount,
      billingAccountDestination: self.target.billingAccount,
    }).$promise.then(() => {
      self.loading.success = true;
      $timeout(() => {
        $state.reload();
      }, 5000);
    }).catch(err => new TucToastError(err)).finally(() => {
      self.loading.submit = false;
    });
  };

  self.onChangeSource = function () {
    self.targets = [];
    self.currency = self.source.securityDeposit.currencyCode === 'EUR' ? '€' : self.source.securityDeposit.currencyCode;
    self.amount = 0;

    const targets = _.filter(
      self.sources,
      item => item.value.billingAccount !== self.source.billingAccount,
    );

    // disable target if not the same billing contact than source
    // build a billingAccount->promise object of all the requests to canTransferSecurityDeposit
    return $q
      .all(_.reduce(
        targets,
        (obj, value) => {
          const billingAccount = _.get(value, 'value.billingAccount');
          obj[billingAccount] = OvhApiTelephony.v6().canTransferSecurityDeposit({ // eslint-disable-line
            billingAccount: self.source.billingAccount,
          }, {
            billingAccountDestination: billingAccount,
          }).$promise.then(data => data.value).catch((err) => {
            if (err.status === 400) { // means that deposit cannot be transfered
              return false;
            }
            return $q.reject(err);
          });
          return obj;
        },
        {},
      ))
      .then((billingAccountTransfertStatus) => {
        _.each(targets, (target) => {
          _.set(target, 'disable', !billingAccountTransfertStatus[_.get(target, 'value.billingAccount')]);
        });
        self.targets = targets;
      }).catch((err) => {
        TucToast.error($translate.instant('telephony_group_billing_deposit_movement_capability_error'));
        return $q.reject(err);
      });
  };

  self.getEnabledBillingAccounts = function () {
    return OvhApiTelephony.Aapi().billingAccounts().$promise.then(billingAccounts => _.filter(billingAccounts, { status: 'enabled' }));
  };

  self.getServiceInfos = function (billingAccount) {
    return OvhApiTelephony.v6().getServiceInfos({
      billingAccount,
    }).$promise;
  };

  init();
});
