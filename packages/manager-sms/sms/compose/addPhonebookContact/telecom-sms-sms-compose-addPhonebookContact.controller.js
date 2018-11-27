angular
  .module('managerApp')
  .controller('TelecomSmsSmsComposeAddPhonebookContactCtrl', class TelecomSmsSmsComposeAddPhonebookContactCtrl {
    constructor(
      $filter, $q, $scope, $stateParams, $timeout, $translate, $uibModalInstance,
      phonebooks, OvhApiSms, TucToast, SMS_PHONEBOOKS,
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
      this.availableTypes = _.get(this.constant.SMS_PHONEBOOKS, 'numberFields');
      this.$scope.$watch('AddPhonebookContactCtrl.phonebookContact.sorted', (contacts) => {
        _.each(contacts, (contact) => {
          const alreadyAdded = _.find(this.selectedContacts, { id: contact.id });
          if (contact.isSelected) {
            if (!alreadyAdded) {
              this.selectedContacts.push(contact);
            }
          } else {
            _.pull(this.selectedContacts, alreadyAdded);
          }
        });
      }, true);
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
          bookKey: _.get(phonebook, 'bookKey'),
        }).$promise
        .then(phonebookContactIds => this.$q
          .all(_.map(
            _.chunk(phonebookContactIds, 50),
            id => this.api.sms.phonebooks.phonebookcontact.getBatch({
              serviceName: this.$stateParams.serviceName,
              bookKey: _.get(phonebook, 'bookKey'),
              id,
            }).$promise,
          ))
          .then((chunkResult) => {
            const result = _.pluck(_.flatten(chunkResult), 'value');
            const emptyPhoneNumber = _.get(this.constant.SMS_PHONEBOOKS, 'emptyFields.numbers');
            return _.each(result, (contact) => {
              _.set(contact, 'homeMobile', contact.homeMobile === emptyPhoneNumber ? '' : contact.homeMobile);
              _.set(contact, 'homePhone', contact.homePhone === emptyPhoneNumber ? '' : contact.homePhone);
              _.set(contact, 'workMobile', contact.workMobile === emptyPhoneNumber ? '' : contact.workMobile);
              _.set(contact, 'workPhone', contact.workPhone === emptyPhoneNumber ? '' : contact.workPhone);
            });
          }).then((contacts) => {
            const clonedContacts = [];
            _.each(this.availableTypes, (field) => {
              _.each(_.cloneDeep(contacts), (contact) => {
                _.set(contact, 'type', field);
                _.set(contact, 'id', [contact.id, contact.type].join('_'));
                if (_.isEmpty(_.get(contact, field))) {
                  return;
                }
                clonedContacts.push(_.omit(contact, _.difference(this.availableTypes, [field])));
              });
            });
            return _.flatten(clonedContacts);
          }));
    }

    /**
     * Refresh all phonebook contact list.
     * @return {Promise}
     */
    refresh() {
      this.phonebookContact.isLoading = true;
      this.api.sms.phonebooks.phonebookcontact.resetAllCache();
      return this.fetchPhonebookContact(this.phonebooks.current).then((phonebookContact) => {
        this.phonebookContact.raw = phonebookContact;
        this.sortPhonebookContact();
      }).catch((err) => {
        this.TucToast.error(`${this.$translate.instant('sms_sms_compose_add_phonebook_contact_ko')} ${_.get(err, 'data.message')}`);
        return this.$q.reject(err);
      }).finally(() => {
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
      this.phonebookContact.sorted = _.each(data, (contact) => {
        _.set(contact, 'isSelected', _.some(this.selectedContacts, { id: contact.id }));
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
        return this.$timeout(angular.noop, 1500).then(() => this.close(this.selectedContacts));
      });
    }

    cancel(message) {
      return this.$uibModalInstance.dismiss(message);
    }

    close() {
      return this.$uibModalInstance.close(this.selectedContacts);
    }
  });
