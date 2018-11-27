angular
  .module('managerApp')
  .controller('TelecomSmsPhonebooksCtrl', class TelecomSmsPhonebooksCtrl {
    constructor(
      $document, $filter, $q, $scope, $stateParams, $translate, $timeout, $uibModal, $window,
      OvhApiSms, TucToast, TucToastError, SMS_PHONEBOOKS,
    ) {
      this.$document = $document;
      this.$filter = $filter;
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$timeout = $timeout;
      this.$uibModal = $uibModal;
      this.$window = $window;
      this.api = {
        sms: {
          phonebooks: OvhApiSms.Phonebooks().v6(),
          phonebookContact: OvhApiSms.Phonebooks().PhonebookContact().v6(),
          task: OvhApiSms.Task().v6(),
        },
      };
      this.TucToast = TucToast;
      this.TucToastError = TucToastError;
      this.constant = { SMS_PHONEBOOKS };
    }

    $onInit() {
      this.phonebooks = {
        raw: [],
        current: {},
        isLoading: false,
        hasModalOpened: false,
      };
      this.phonebookContact = {
        raw: [],
        groupsAvailable: [],
        paginated: null,
        sorted: null,
        selected: {},
        orderBy: 'surname',
        orderDesc: false,
        isLoading: false,
        isImporting: false,
        isExporting: false,
        isDeleting: false,
        poller: null,
      };

      this.resetAllCache();
      this.phonebooks.isLoading = true;
      this.fetchPhonebooks().then((phonebooks) => {
        this.phonebooks.raw = phonebooks;
        this.phonebooks.current = _.find(this.phonebooks.raw, {
          bookKey: this.$stateParams.bookKey,
        }) || _.head(this.phonebooks.raw);
        this.phonebookContact.isLoading = true;
        return this.fetchPhonebookContact(this.phonebooks.current).then((phonebookContact) => {
          this.phonebookContact.raw = angular.copy(phonebookContact);
          this.sortPhonebookContact();
          this.updatePhonebookContactGroups();
        }).finally(() => {
          this.phonebookContact.isLoading = false;
        });
      }).catch((err) => {
        this.TucToast.error(`${this.$translate.instant('sms_phonebooks_phonebook_ko')} ${_.get(err, 'data.message')}`);
        return this.$q.rejec(err);
      }).finally(() => {
        this.phonebooks.isLoading = false;
      });
      this.$scope.$on('$destroy', () => this.$timeout.cancel(this.phonebookContact.poller));
    }

    /**
     * Reset all cache from phonebooks and phonebookContact.
     */
    resetAllCache() {
      this.api.sms.phonebooks.resetAllCache();
      this.api.sms.phonebookContact.resetAllCache();
    }

    /**
     * Fetch all phonebooks.
     * @return {Promise}
     */
    fetchPhonebooks() {
      return this.api.sms.phonebooks
        .query({
          serviceName: this.$stateParams.serviceName,
        }).$promise
        .then(phonebooksIds => this.$q
          .all(_.map(phonebooksIds, bookKey => this.api.sms.phonebooks
            .get({
              serviceName: this.$stateParams.serviceName,
              bookKey,
            }).$promise))
          .then(phonebooks => _.sortBy(phonebooks, 'name')));
    }

    /**
     * Fetch all phonebook contact.
     * @param  {Object} phonebook
     * @return {Promise}
     */
    fetchPhonebookContact(phonebook) {
      if (!_.size(phonebook)) {
        return this.$q.when([]);
      }
      return this.api.sms.phonebookContact
        .query({
          serviceName: this.$stateParams.serviceName,
          bookKey: _.get(phonebook, 'bookKey'),
        }).$promise
        .then(phonebookContactIds => this.$q
          .all(_.map(
            _.chunk(phonebookContactIds, 50),
            id => this.api.sms.phonebookContact
              .getBatch({
                serviceName: this.$stateParams.serviceName,
                bookKey: _.get(phonebook, 'bookKey'),
                id,
              }).$promise,
          ))
          .then((chunkResult) => {
            const result = _.pluck(_.flatten(chunkResult), 'value');
            const emptyGroup = _.get(this.constant.SMS_PHONEBOOKS, 'emptyFields.group');
            const emptyPhoneNumber = _.get(this.constant.SMS_PHONEBOOKS, 'emptyFields.numbers');
            return _.each(result, (contact) => {
              _.set(contact, 'group', contact.group === emptyGroup ? '' : contact.group);
              _.set(contact, 'homeMobile', contact.homeMobile === emptyPhoneNumber ? '' : contact.homeMobile);
              _.set(contact, 'homePhone', contact.homePhone === emptyPhoneNumber ? '' : contact.homePhone);
              _.set(contact, 'workMobile', contact.workMobile === emptyPhoneNumber ? '' : contact.workMobile);
              _.set(contact, 'workPhone', contact.workPhone === emptyPhoneNumber ? '' : contact.workPhone);
            });
          }));
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
      this.phonebookContact.sorted = data;

      // avoid pagination bug…
      if (_.size(this.phonebookContact.sorted) === 0) {
        this.phonebookContact.paginated = [];
      }
    }

    /**
     * Order phonebook contact.
     * @param  {String} by
     */
    orderPhonebookContactBy(by) {
      if (this.phonebookContact.orderBy === by) {
        this.phonebookContact.orderDesc = !this.phonebookContact.orderDesc;
      } else {
        this.phonebookContact.orderBy = by;
      }
      this.sortPhonebookContact();
    }

    /**
     * Update phonebook contact groups list.
     */
    updatePhonebookContactGroups() {
      this.phonebookContact.groupsAvailable = _.chain(this.phonebookContact.raw)
        .pluck('group')
        .pull(_.get(this.constant.SMS_PHONEBOOKS, 'emptyFields.group'))
        .uniq()
        .compact()
        .value();
    }

    /**
     * Change phonebook.
     * @return {Promise}
     */
    changePhonebook() {
      return this.refresh();
    }

    /**
     * Get selected contact.
     * @return {Array}
     */
    getSelection() {
      return _.filter(
        this.phonebookContact.raw,
        contact => contact
          && this.phonebookContact.selected
          && this.phonebookContact.selected[contact.id],
      );
    }

    /**
     * Start phonebook edition.
     */
    startEdition() {
      this.phonebooks.current.inEdition = true;
      this.phonebooks.current.newName = angular.copy(this.phonebooks.current.name);
      this.$timeout(() => this.$document.find("input[name='phonebookName']").select());
    }

    /**
     * Cancel phonebook edition.
     */
    cancelEdition() {
      this.phonebooks.current.inEdition = false;
    }

    /**
     * Update phonebook.
     * @return {Promise}
     */
    updatePhonebook() {
      return this.api.sms.phonebooks.update({
        serviceName: this.$stateParams.serviceName,
        bookKey: _.get(this.phonebooks.current, 'bookKey'),
      }, {
        name: this.phonebooks.current.newName,
      }).$promise.then(() => {
        this.api.sms.phonebooks.resetAllCache();
        return this.fetchPhonebooks().then((phonebooks) => {
          this.phonebooks.raw = phonebooks;
          this.phonebooks.current = _.find(this.phonebooks.raw, {
            name: this.phonebooks.current.newName,
          });
          return phonebooks;
        });
      }).catch((err) => {
        this.TucToast.error(`${this.$translate.instant('sms_phonebooks_phonebook_update_ko')} ${_.get(err, 'data.message')}`);
        return this.$q.reject(err);
      }).finally(() => {
        this.phonebooks.current.inEdition = false;
      });
    }

    /**
     * Opens a modal to delete phonebook.
     */
    deletePhonebook() {
      this.phonebooks.hasModalOpened = true;
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/phonebooks/delete/telecom-sms-phonebooks-delete.html',
        controller: 'TelecomSmsPhonebooksDeleteCtrl',
        controllerAs: 'DeleteCtrl',
        resolve: {
          phonebook: () => this.phonebooks.current,
        },
      });
      modal.result.then(() => {
        this.api.sms.phonebooks.resetAllCache();
        return this.fetchPhonebooks().then((phonebooks) => {
          this.phonebooks.raw = phonebooks;
          this.phonebooks.current = _.isEmpty(this.phonebooks.raw)
            ? {} : _.head(this.phonebooks.raw);
          return this.refresh();
        });
      }).catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(this.$translate.instant('sms_phonebooks_phonebook_delete_ko', { error: _.get(err, 'msg.data.message') }));
        }
      }).finally(() => {
        this.phonebooks.hasModalOpened = false;
      });
    }

    /**
     * Opens a modal to create a new phonebook contact.
     */
    createPhonebookContact() {
      this.phonebooks.hasModalOpened = true;
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/phonebooks/contact-create/telecom-sms-phonebooks-phonebook-contact-create.html',
        controller: 'TelecomSmsPhonebooksPhonebookContactCreateCtrl',
        controllerAs: 'ContactCreateCtrl',
        resolve: {
          data: () => {
            const data = {
              phonebook: this.phonebooks.current,
              groupsAvailable: this.phonebookContact.groupsAvailable,
            };
            return data;
          },
        },
      });
      modal.result.then(() => this.refresh()).catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(this.$translate.instant('sms_phonebooks_phonebook_contact_create_ko', { error: _.get(err, 'msg.data.message') }));
        }
      }).finally(() => {
        this.phonebooks.hasModalOpened = false;
      });
    }

    /**
     * Opens a modal to edit a given phonebook contact.
     * @param  {Object} contact
     */
    updatePhonebookContact(contact) {
      this.phonebooks.hasModalOpened = true;
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/phonebooks/contact-update/telecom-sms-phonebooks-phonebook-contact-update.html',
        controller: 'TelecomSmsPhonebooksPhonebookContactUpdateCtrl',
        controllerAs: 'ContactUpdateCtrl',
        resolve: {
          data: () => {
            const data = {
              phonebook: this.phonebooks.current,
              groupsAvailable: this.phonebookContact.groupsAvailable,
              contact,
            };
            return data;
          },
        },
      });
      modal.result.then(() => this.refresh()).catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(this.$translate.instant('sms_phonebooks_phonebook_contact_update_ko', { error: _.get(err, 'msg.data.message') }));
        }
      }).finally(() => {
        this.phonebooks.hasModalOpened = false;
      });
    }

    /**
     * Opens a modal to delete a given phonebook contact.
     * @param  {Object} contact
     */
    deletePhonebookContact(contact) {
      this.phonebooks.hasModalOpened = true;
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/phonebooks/contact-delete/telecom-sms-phonebooks-phonebook-contact-delete.html',
        controller: 'TelecomSmsPhonebooksPhonebookContactDeleteCtrl',
        controllerAs: 'ContactDeleteCtrl',
        resolve: {
          data: () => {
            const data = {
              phonebook: this.phonebooks.current,
              contact,
            };
            return data;
          },
        },
      });
      modal.result.then(() => this.refresh()).catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(this.$translate.instant('sms_phonebooks_phonebook_contact_delete_ko', { error: _.get(err, 'msg.data.message') }));
        }
      }).finally(() => {
        this.phonebooks.hasModalOpened = false;
      });
    }

    /**
     * Delete all selected phonebook contact.
     * @return {Promise}
     */
    deleteSelectedPhonebookContact() {
      const contacts = this.getSelection();
      const queries = contacts.map(contact => this.api.sms.phonebookContact.delete({
        serviceName: this.$stateParams.serviceName,
        bookKey: _.get(this.phonebooks.current, 'bookKey'),
        id: contact.id,
      }).$promise);
      this.phonebookContact.isDeleting = true;
      queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
      this.TucToast.info(this.$translate.instant('sms_phonebooks_phonebook_contact_selected_delete_info'));
      return this.$q.all(queries).then(() => {
        this.phonebookContact.selected = {};
        return this.refresh();
      }).catch((err) => {
        this.TucToast.error(this.$translate.instant('sms_phonebooks_phonebook_contact_selected_delete_ko', { error: _.get(err, 'data.message') }));
        return this.$q.reject(err);
      }).finally(() => {
        this.phonebookContact.isDeleting = false;
      });
    }

    /**
     * Opens a modal to import phonebook contact.
     */
    importPhonebookContact() {
      this.phonebooks.hasModalOpened = true;
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/phonebooks/contact-import/telecom-sms-phonebooks-phonebook-contact-import.html',
        controller: 'TelecomSmsPhonebooksPhonebookContactImportCtrl',
        controllerAs: 'ContactImportCtrl',
        resolve: {
          phonebook: () => this.phonebooks.current,
        },
      });
      modal.result.then((response) => {
        if (_.has(response, 'taskId')) {
          this.phonebookContact.isImporting = true;
          return this.api.sms.task.poll(this.$scope, {
            serviceName: this.$stateParams.serviceName,
            taskId: response.taskId,
          }).finally(() => {
            this.phonebookContact.isImporting = false;
            return this.refresh();
          });
        }
        return response;
      }).catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(this.$translate.instant('sms_phonebooks_phonebook_contact_import_ko', { error: _.get(err, 'msg.data.message') }));
        }
      }).finally(() => {
        this.phonebooks.hasModalOpened = false;
      });
    }

    /**
     * Export phonebook contact.
     * @return {Promise}
     */
    exportPhonebookContact() {
      this.phonebookContact.isExporting = true;
      const tryGetCsvExport = () => this.api.sms.phonebooks.getExport({
        serviceName: this.$stateParams.serviceName,
        bookKey: _.get(this.phonebooks.current, 'bookKey'),
        format: 'csv',
      }).$promise.then((exportPhonebook) => {
        if (exportPhonebook.status === 'done') {
          return exportPhonebook;
        }
        this.phonebookContact.poller = this.$timeout(tryGetCsvExport, 1000);
        return this.phonebookContact.poller;
      });
      return tryGetCsvExport().then((phonebook) => {
        this.$window.location.href = phonebook.url;
        this.TucToast.success(this.$translate.instant('sms_phonebooks_phonebook_contact_export_ok'));
      }).catch((err) => {
        this.TucToast.error(`${this.$translate.instant('sms_phonebooks_phonebook_contact_export_ko')} ${_.get(err, 'data.message')}`);
        return this.$q.reject(err);
      }).finally(() => {
        this.phonebookContact.isExporting = false;
      });
    }

    /**
     * Refresh all phonebook contact list.
     * @return {Promise}
     */
    refresh() {
      this.phonebookContact.isLoading = true;
      this.api.sms.phonebookContact.resetAllCache();
      return this.fetchPhonebookContact(this.phonebooks.current).then((phonebookContact) => {
        this.phonebookContact.raw = angular.copy(phonebookContact);
        this.sortPhonebookContact();
        this.updatePhonebookContactGroups();
      }).catch((err) => {
        this.TucToast.error(`${this.$translate.instant('sms_phonebooks_phonebook_contact_ko')} ${_.get(err, 'data.message')}`);
        return this.$q.reject(err);
      }).finally(() => {
        this.phonebookContact.isLoading = false;
      });
    }
  });
