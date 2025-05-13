import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

export default /* @ngInject */ function TelecomTelephonyBillingAccountBillingDepositMovementCtrl(
  $q,
  $state,
  $timeout,
  $translate,
  OvhApiTelephony,
  TucToastError,
  TucToast,
) {
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

    self
      .getEnabledBillingAccounts()
      .then((billingAccountsParam) => {
        let billingAccounts = map(billingAccountsParam, (item) => ({
          label: item.description || item.billingAccount,
          value: item,
        }));
        billingAccounts = sortBy(billingAccounts, 'label');
        self.sources = billingAccounts;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loading.init = false;
      });
  }

  self.submit = function submit() {
    self.loading.submit = true;

    return OvhApiTelephony.v6()
      .transferSecurityDeposit(
        {
          billingAccount: self.source.billingAccount,
        },
        {
          amount: self.amount,
          billingAccountDestination: self.target.billingAccount,
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

  self.onChangeSource = function onChangeSource() {
    self.targets = [];
    self.currency =
      self.source.securityDeposit.currencyCode === 'EUR'
        ? '€'
        : self.source.securityDeposit.currencyCode;
    self.amount = 0;

    const targets = filter(
      self.sources,
      (item) => item.value.billingAccount !== self.source.billingAccount,
    );

    self.targets = targets;
    self.target = null;
    return targets;
  };

  self.onChangeTarget = function onChangeTarget() {
    self.targetError = false;
    self.canTransferSecurityDepositOnTarget = false;
    if (self.target) {
      return OvhApiTelephony.v6()
        .canTransferSecurityDeposit(
          {
            billingAccount: self.source.billingAccount,
          },
          {
            billingAccountDestination: self.target.billingAccount,
          },
        )
        .$promise.then((data) => data.value)
        .catch((err) => {
          if (err.status === 400) {
            return false;
          }
          return $q.reject(err);
        })
        .then((canTransferSecurityDeposit) => {
          self.canTransferSecurityDepositOnTarget = canTransferSecurityDeposit;
          self.targetError = !canTransferSecurityDeposit;
        })
        .catch(() => {
          TucToast.error(
            $translate.instant(
              'telephony_group_billing_deposit_movement_capability_error',
            ),
          );
        });
    }
    return $q.resolve();
  };

  self.getEnabledBillingAccounts = function getEnabledBillingAccounts() {
    return OvhApiTelephony.Aapi()
      .billingAccounts()
      .$promise.then((billingAccounts) =>
        filter(billingAccounts, { status: 'enabled' }),
      );
  };

  self.getServiceInfos = function getServiceInfos(billingAccount) {
    return OvhApiTelephony.v6().getServiceInfos({
      billingAccount,
    }).$promise;
  };

  init();
}
