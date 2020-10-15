import isEmpty from 'lodash/isEmpty';

export default /* @ngInject */ function TelecomTelephonyBillingAccountPhonebookContactAddCtrl(
  $q,
  $stateParams,
  $timeout,
  $uibModalInstance,
  TelephonyMediator,
  OvhApiTelephony,
  TucPhonebookcontact,
  data,
) {
  const self = this;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.isValidNumber = function isValidNumber(value) {
    return !isEmpty(value) ? TelephonyMediator.IsValidNumber(value) : true;
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            EVENTS            =
    =============================== */

  self.handleContactPhoneNumber = function handleContactPhoneNumber() {
    return TucPhonebookcontact.hasAtLeastOnePhoneNumber(self.phonecontactForm);
  };

  /* -----  End of EVENTS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.setGroup = function setGroup($event, group) {
    $event.preventDefault();
    self.phonecontactForm.group = group;
  };

  self.add = function add() {
    self.phonecontactForm.isAdding = true;
    return $q
      .all([
        OvhApiTelephony.Phonebook()
          .PhonebookContact()
          .v6()
          .create(
            {
              billingAccount: $stateParams.billingAccount,
              bookKey: self.phonebook.bookKey,
            },
            TucPhonebookcontact.getContactData(self.phonecontactForm),
          ).$promise,
        $timeout(angular.noop, 1000),
      ])
      .then(
        () => {
          self.phonecontactForm.isAdding = false;
          self.phonecontactForm.hasBeenAdded = true;
          return $timeout(self.close, 1500);
        },
        (error) =>
          self.cancel({
            type: 'API',
            msg: error,
          }),
      );
  };

  self.cancel = function cancel(message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function close() {
    return $uibModalInstance.close(true);
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.phonebook = angular.copy(data.phonebook);
    self.groupsAvailable = angular.copy(data.groupsAvailable);
    self.phonecontactForm = {
      name: null,
      surname: null,
      group: null,
      homePhone: null,
      homeMobile: null,
      workPhone: null,
      workMobile: null,
      isAdding: false,
      hasBeenAdded: false,
    };
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
