import angular from 'angular';
import chunk from 'lodash/chunk';
import cloneDeep from 'lodash/cloneDeep';
import difference from 'lodash/difference';
import each from 'lodash/each';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import omit from 'lodash/omit';
import pull from 'lodash/pull';
import set from 'lodash/set';
import some from 'lodash/some';

export default class {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $scope,
    $stateParams,
    $timeout,
    $translate,
    $uibModalInstance,
    phonebooks,
    OvhApiSms,
    TucToast,
    SMS_PHONEBOOKS,
  ) {
    this.$filter = $filter;
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.phonebooks = phonebooks;
    this.api = {
      sms: {
        phonebooks: {
          phonebookcontact: OvhApiSms.Phonebooks().PhonebookContact().v6(),
        },
      },
    };
    this.TucToast = TucToast;
    this.constant = { SMS_PHONEBOOKS };
  }

  $onInit() {
    this.model = {
      phonebooks: this.phonebooks,
    };
    this.phonebookContact = {
      raw: [],
      sorted: null,
      selected: {},
      orderBy: 'surname',
      orderDesc: false,
      isLoading: false,
      isAdding: false,
      hasBeenAdded: false,
    };
    this.selectedContacts = angular.copy(this.phonebooks.lists);
    this.availableTypes = get(this.constant.SMS_PHONEBOOKS, 'numberFields');
    this.$scope.$watch(
      'AddPhonebookContactCtrl.phonebookContact.sorted',
      (contacts) => {
        each(contacts, (contact) => {
          const alreadyAdded = find(this.selectedContacts, { id: contact.id });
          if (contact.isSelected) {
            if (!alreadyAdded) {
              this.selectedContacts.push(contact);
            }
          } else {
            pull(this.selectedContacts, alreadyAdded);
          }
        });
      },
      true,
    );
    this.refresh();
  }

  /**
   * Fetch all phonebook contact.
   * @param  {Object} phonebook
   * @return {Promise}
   */
  fetchPhonebookContact(phonebook) {
    return this.api.sms.phonebooks.phonebookcontact
      .query({
        serviceName: this.$stateParams.serviceName,
        bookKey: get(phonebook, 'bookKey'),
      })
      .$promise.then((phonebookContactIds) =>
        this.$q
          .all(
            map(
              chunk(phonebookContactIds, 50),
              (id) =>
                this.api.sms.phonebooks.phonebookcontact.getBatch({
                  serviceName: this.$stateParams.serviceName,
                  bookKey: get(phonebook, 'bookKey'),
                  id,
                }).$promise,
            ),
          )
          .then((chunkResult) => {
            const result = map(flatten(chunkResult), 'value');
            const emptyPhoneNumber = get(
              this.constant.SMS_PHONEBOOKS,
              'emptyFields.numbers',
            );
            return each(result, (contact) => {
              set(
                contact,
                'homeMobile',
                contact.homeMobile === emptyPhoneNumber
                  ? ''
                  : contact.homeMobile,
              );
              set(
                contact,
                'homePhone',
                contact.homePhone === emptyPhoneNumber ? '' : contact.homePhone,
              );
              set(
                contact,
                'workMobile',
                contact.workMobile === emptyPhoneNumber
                  ? ''
                  : contact.workMobile,
              );
              set(
                contact,
                'workPhone',
                contact.workPhone === emptyPhoneNumber ? '' : contact.workPhone,
              );
            });
          })
          .then((contacts) => {
            const clonedContacts = [];
            each(this.availableTypes, (field) => {
              each(cloneDeep(contacts), (contact) => {
                set(contact, 'type', field);
                set(contact, 'id', [contact.id, contact.type].join('_'));
                if (isEmpty(get(contact, field))) {
                  return;
                }
                clonedContacts.push(
                  omit(contact, difference(this.availableTypes, [field])),
                );
              });
            });
            return flatten(clonedContacts);
          }),
      );
  }

  /**
   * Refresh all phonebook contact list.
   * @return {Promise}
   */
  refresh() {
    this.phonebookContact.isLoading = true;
    this.api.sms.phonebooks.phonebookcontact.resetAllCache();
    return this.fetchPhonebookContact(this.phonebooks.current)
      .then((phonebookContact) => {
        this.phonebookContact.raw = phonebookContact;
        this.sortPhonebookContact();
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'sms_sms_compose_add_phonebook_contact_ko',
          )} ${get(err, 'data.message')}`,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.phonebookContact.isLoading = false;
      });
  }

  /**
   * Sort phonebook contact.
   */
  sortPhonebookContact() {
    let data = angular.copy(this.phonebookContact.raw);
    data = this.$filter('orderBy')(
      data,
      this.phonebookContact.orderBy,
      this.phonebookContact.orderDesc,
    );
    this.phonebookContact.sorted = each(data, (contact) => {
      set(
        contact,
        'isSelected',
        some(this.selectedContacts, { id: contact.id }),
      );
    });
  }

  /**
   * Add phonebook contact.
   */
  add() {
    this.phonebookContact.isAdding = true;
    return this.$timeout(angular.noop, 500).then(() => {
      this.phonebookContact.isAdding = false;
      this.phonebookContact.hasBeenAdded = true;
      return this.$timeout(angular.noop, 1500).then(() =>
        this.close(this.selectedContacts),
      );
    });
  }

  cancel(message) {
    return this.$uibModalInstance.dismiss(message);
  }

  close() {
    return this.$uibModalInstance.close(this.selectedContacts);
  }
}
