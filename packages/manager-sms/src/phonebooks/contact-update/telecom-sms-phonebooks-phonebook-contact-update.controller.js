import angular from 'angular';
import _ from 'lodash';

export default class TelecomSmsPhonebooksPhonebookContactUpdateCtrl {
  constructor(
    $q, $stateParams, $timeout, $uibModalInstance,
    data, TucPhonebookcontact, OvhApiSms, TelecomSmsPhoneBooksNumber,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.data = data;
    this.TucPhonebookcontact = TucPhonebookcontact;
    this.api = {
      sms: {
        phonebooks: {
          phonebookContact: OvhApiSms.Phonebooks().PhonebookContact().v6(),
        },
      },
    };
    this.TelecomSmsPhoneBooksNumber = TelecomSmsPhoneBooksNumber;
  }

  $onInit() {
    this.phonebook = angular.copy(this.data.phonebook);
    this.groupsAvailable = angular.copy(this.data.groupsAvailable);
    this.contact = angular.copy(this.data.contact);
    this.phonecontactForm = {
      surname: null,
      name: null,
      group: null,
      homePhone: null,
      homeMobile: null,
      workPhone: null,
      workMobile: null,
      isUpdating: false,
      hasBeenUpdated: false,
    };
    _.assign(this.phonecontactForm, this.contact);
  }

  /**
   * Set group.
   * @param {Object} $event
   * @param {String} group
   */
  setGroup($event, group) {
    $event.preventDefault();
    this.phonecontactForm.group = group;
  }

  /**
   * Update phonebook contact.
   * @return {Promise}
   */
  update() {
    this.phonecontactForm.isUpdating = true;
    return this.$q.all([
      this.api.sms.phonebooks.phonebookContact.update({
        serviceName: this.$stateParams.serviceName,
        bookKey: _.get(this.phonebook, 'bookKey'),
        id: _.get(this.contact, 'id'),
      }, this.TucPhonebookcontact.getContactData(this.phonecontactForm)).$promise,
      this.$timeout(angular.noop, 1000),
    ]).then(() => {
      this.phonecontactForm.isUpdating = false;
      this.phonecontactForm.hasBeenUpdated = true;
      return this.$timeout(() => this.close(), 1500);
    }).catch(error => this.cancel({
      type: 'API',
      msg: error,
    }));
  }

  /**
   * Is valid number.
   * @param  {String}  value
   * @return {Boolean}
   */
  isValidNumber(value) {
    return !_.isEmpty(value) ? this.TelecomSmsPhoneBooksNumber.IsValid(value) : true;
  }

  /**
   * Handle contact phone number.
   * @return {Boolean}
   */
  handleContactPhoneNumber() {
    return this.TucPhonebookcontact.hasAtLeastOnePhoneNumber(this.phonecontactForm);
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }

  /**
   * Has changed helper.
   * @return {Boolean}
   */
  hasChanged() {
    const fields = ['surname', 'name', 'group', 'homePhone', 'homeMobile', 'workPhone', 'workMobile'];
    return !_.isEqual(_.pick(this.phonecontactForm, fields), _.pick(this.data.contact, fields));
  }
}
