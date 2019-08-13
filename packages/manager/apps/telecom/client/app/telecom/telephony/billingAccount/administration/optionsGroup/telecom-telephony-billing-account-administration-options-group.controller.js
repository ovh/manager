angular.module('managerApp').controller('TelecomTelephonyBillingAccountAdministrationOptionsGroup', function ($q, $state, $stateParams, $translate, OvhApiTelephony, OvhApiMe, TucToast) {
  const self = this;

  this.$state = $state;

  const telephonyAttributes = ['creditThreshold', 'description',
    'hiddenExternalNumber', 'overrideDisplayedNumber'];

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function fetchSettings() {
    OvhApiTelephony.v6().resetCache();
    OvhApiTelephony.v6().resetQueryCache();
    return $q.all({
      telephony: OvhApiTelephony.v6().get({ billingAccount: $stateParams.billingAccount }).$promise,
      user: OvhApiMe.Telephony().Settings().v6().get().$promise,
    });
  }

  self.hasChanges = function () {
    return !(
      angular.equals(self.telephonySettings, self.optionsGroupForm.telephony)
            && angular.equals(self.userSettings, self.optionsGroupForm.user)
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.changeSettings = function () {
    if (self.optionsGroupSettings.$invalid || self.isChanging) {
      return this.$q.reject();
    }

    self.isChanging = true;
    return $q.all([
      OvhApiTelephony.v6().edit({
        billingAccount: $stateParams.billingAccount,
      }, _.pick(self.optionsGroupForm.telephony, telephonyAttributes)).$promise,
      OvhApiMe.Telephony().Settings().v6().change({
        settings: self.optionsGroupForm.user,
      }).$promise,
    ]).then(() => {
      self.telephonySettings = angular.copy(self.optionsGroupForm.telephony);
      self.userSettings = angular.copy(self.optionsGroupForm.user);
      TucToast.success($translate.instant('telephony_billing_account_administration_options_group_success_changing'));
    }).catch((err) => {
      TucToast.error([$translate.instant('telephony_billing_account_administration_options_group_error_changing'), _.get(err, 'data.message', '')].join(' '));
      return $q.reject(err);
    }).finally(() => {
      self.isChanging = false;
    });
  };

  self.cancelChange = function () {
    self.optionsGroupForm.telephony = angular.copy(self.telephonySettings);
    self.optionsGroupForm.user = angular.copy(self.userSettings);
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.telephonySettings = null;
    self.userSettings = null;
    self.optionsGroupForm = {
      telephony: null,
      user: null,
    };
    self.isLoading = true;
    return fetchSettings().then((settings) => {
      self.telephonySettings = settings.telephony;
      self.userSettings = settings.user;
      self.optionsGroupForm.telephony = angular.copy(self.telephonySettings);
      self.optionsGroupForm.user = angular.copy(self.userSettings);
    }).catch((err) => {
      TucToast.error([$translate.instant('telephony_billing_account_administration_options_group_error_loading'), _.get(err, 'data.message', '')].join(' '));
      return $q.reject(err);
    }).finally(() => {
      self.isLoading = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
