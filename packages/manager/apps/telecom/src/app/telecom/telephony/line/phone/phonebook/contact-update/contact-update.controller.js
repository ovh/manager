import assign from 'lodash/assign';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

export default /* @ngInject */ function TelecomTelephonyLinePhonePhonebookContactUpdateCtrl(
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

  self.hasChanged = function hasChanged() {
    const fields = [
      'name',
      'surname',
      'group',
      'homePhone',
      'homeMobile',
      'workPhone',
      'workMobile',
    ];
    return !isEqual(
      pick(self.phonecontactForm, fields),
      pick(data.contact, fields),
    );
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

  self.update = function update() {
    self.phonecontactForm.isAdding = true;
    return $q
      .all([
        OvhApiTelephony.Line()
          .Phone()
          .Phonebook()
          .PhonebookContact()
          .v6()
          .update(
            {
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
              bookKey: self.phonebook.bookKey,
              id: self.contact.id,
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
    assign(self.phonecontactForm, self.contact);
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
