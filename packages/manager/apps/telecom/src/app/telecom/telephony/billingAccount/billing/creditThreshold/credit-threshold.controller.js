import map from 'lodash/map';

export default /* @ngInject */ function TelecomTelephonyBillingAccountBillingCreditThresholdCtrl(
  $q,
  $state,
  $stateParams,
  $translate,
  $timeout,
  OvhApiOrderTelephony,
  OvhApiTelephony,
  TucToastError,
) {
  const self = this;

  self.loading = {
    init: true,
    submit: false,
    success: false,
  };

  self.creditThreshold = null;
  self.allowedOutPlan = null;
  self.allowedOutplan = null;
  self.credits = [];
  self.credit = null;
  self.newCredit = null;
  self.contractsAccepted = false;
  self.contracts = [];

  function init() {
    self.loading.init = true;

    $q.all({
      billingAccount: self.getBillingAccount(),
      credits: self.getAllowedCreditThreshold(),
      contracts: self.getContracts(),
    })
      .then((data) => {
        self.creditThreshold = data.billingAccount.creditThreshold;
        self.currentOutplan = data.billingAccount.currentOutplan;
        self.allowedOutplan = data.billingAccount.allowedOutplan;
        self.credits = map(data.credits, (credit) => ({
          label: `${credit.text} ${$translate.instant(
            'telephony_group_billing_credit_threshold_without_tax',
          )}`,
          value: credit,
          disable: credit.value === self.creditThreshold.value,
        }));
        self.contracts = data.contracts.contracts;
        self.contractsAccepted = false;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loading.init = false;
      });
  }

  self.onChangeCredit = function onChangeCredit() {
    if (self.credit) {
      self.newCredit = self.credit.value;
    }
  };

  self.submit = function submit() {
    self.loading.submit = true;

    return OvhApiTelephony.v6()
      .edit(
        {
          billingAccount: $stateParams.billingAccount,
        },
        {
          creditThreshold: self.newCredit,
        },
      )
      .$promise.then(() => {
        self.loading.success = true;
        $timeout(() => {
          $state.reload();
        }, 5000);
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loading.submit = false;
      });
  };

  self.getBillingAccount = function getBillingAccount() {
    return OvhApiTelephony.v6().get({
      billingAccount: $stateParams.billingAccount,
    }).$promise;
  };

  self.getAllowedCreditThreshold = function getAllowedCreditThreshold() {
    return OvhApiTelephony.v6().allowedCreditThreshold({
      billingAccount: $stateParams.billingAccount,
    }).$promise;
  };

  self.getContracts = function getContracts() {
    return OvhApiOrderTelephony.v6().getNewBillingAccount().$promise;
  };

  init();
}
