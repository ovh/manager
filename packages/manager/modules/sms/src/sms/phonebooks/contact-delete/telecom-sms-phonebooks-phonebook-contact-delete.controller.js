import angular from 'angular';
import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($q, $stateParams, $timeout, $uibModalInstance, data, OvhApiSms) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.data = data;
    this.api = {
      sms: {
        phonebooks: {
          phonebookContact: OvhApiSms.Phonebooks().PhonebookContact().v6(),
        },
      },
    };
  }

  $onInit() {
    this.phonebook = angular.copy(this.data.phonebook);
    this.contact = angular.copy(this.data.contact);
    this.isDeleting = false;
    this.deleted = false;
  }

  /**
   * Delete phonebook contact.
   * @return {Promise}
   */
  delete() {
    this.isDeleting = true;
    return this.$q
      .all([
        this.api.sms.phonebooks.phonebookContact.delete({
          serviceName: this.$stateParams.serviceName,
          bookKey: get(this.phonebook, 'bookKey'),
          id: get(this.contact, 'id'),
        }).$promise,
        this.$timeout(angular.noop, 1000),
      ])
      .then(() => {
        this.isDeleting = false;
        this.deleted = true;
        return this.$timeout(() => this.close(), 1500);
      })
      .catch((error) =>
        this.cancel({
          type: 'API',
          msg: error,
        }),
      );
  }

  /**
   * Get phonebook contact name.
   * @return {String}
   */
  getContactName() {
    return `${get(this.contact, 'surname')} ${get(this.contact, 'name')}`;
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(true);
  }
}
