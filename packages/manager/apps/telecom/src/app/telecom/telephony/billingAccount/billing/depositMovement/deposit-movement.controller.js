import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
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

    // disable target if not the same billing contact than source
    // build a billingAccount->promise object of all the requests to canTransferSecurityDeposit
    return $q
      .all(
        reduce(
          targets,
          (obj, value) => {
            const billingAccount = get(value, 'value.billingAccount');
            // eslint-disable-next-line no-param-reassign
            obj[billingAccount] = OvhApiTelephony.v6()
              .canTransferSecurityDeposit(
                {
                  billingAccount: self.source.billingAccount,
                },
                {
                  billingAccountDestination: billingAccount,
                },
              )
              .$promise.then((data) => data.value)
              .catch((err) => {
                if (err.status === 400) {
                  // means that deposit cannot be transfered
                  return false;
                }
                return $q.reject(err);
              });
            return obj;
          },
          {},
        ),
      )
      .then((billingAccountTransfertStatus) => {
        forEach(targets, (target) => {
          set(
            target,
            'disable',
            !billingAccountTransfertStatus[get(target, 'value.billingAccount')],
          );
        });
        self.targets = targets;
      })
      .catch((err) => {
        TucToast.error(
          $translate.instant(
            'telephony_group_billing_deposit_movement_capability_error',
          ),
        );
        return $q.reject(err);
      });
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
