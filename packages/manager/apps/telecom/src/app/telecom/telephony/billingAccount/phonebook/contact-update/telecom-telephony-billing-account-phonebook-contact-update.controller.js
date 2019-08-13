angular.module('managerApp').controller('TelecomTelephonyBillingAccountPhonebookContactUpdateCtrl', function ($q, $stateParams, $timeout, $uibModalInstance, TelephonyMediator, OvhApiTelephony, TucPhonebookcontact, data) {
  const self = this;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.isValidNumber = function (value) {
    return !_.isEmpty(value) ? TelephonyMediator.IsValidNumber(value) : true;
  };

  self.hasChanged = function () {
    const fields = ['name', 'surname', 'group', 'homePhone', 'homeMobile', 'workPhone', 'workMobile'];
    return !_.isEqual(_.pick(self.phonecontactForm, fields), _.pick(data.contact, fields));
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            EVENTS            =
    =============================== */

  self.handleContactPhoneNumber = function () {
    return TucPhonebookcontact.hasAtLeastOnePhoneNumber(self.phonecontactForm);
  };

  /* -----  End of EVENTS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.setGroup = function ($event, group) {
    $event.preventDefault();
    self.phonecontactForm.group = group;
  };

  self.update = function () {
    self.phonecontactForm.isAdding = true;
    return $q.all([
      OvhApiTelephony.Phonebook().PhonebookContact().v6().update({
        billingAccount: $stateParams.billingAccount,
        bookKey: self.phonebook.bookKey,
        id: self.contact.id,
      }, TucPhonebookcontact.getContactData(self.phonecontactForm)).$promise,
      $timeout(angular.noop, 1000),
    ]).then(() => {
      self.phonecontactForm.isAdding = false;
      self.phonecontactForm.hasBeenAdded = true;
      return $timeout(self.close, 1500);
    }, error => self.cancel({
      type: 'API',
      msg: error,
    }));
  };

  self.cancel = function (message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function () {
    return $uibModalInstance.close(true);
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.phonebook = angular.copy(data.phonebook);
    self.contact = angular.copy(data.contact);
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
    _.assign(self.phonecontactForm, self.contact);
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
