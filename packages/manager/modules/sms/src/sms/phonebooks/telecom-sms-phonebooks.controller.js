import angular from 'angular';
import chunk from 'lodash/chunk';
import compact from 'lodash/compact';
import each from 'lodash/each';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import pull from 'lodash/pull';
import set from 'lodash/set';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';

import createController from './contact-create/telecom-sms-phonebooks-phonebook-contact-create.controller';
import createTemplate from './contact-create/telecom-sms-phonebooks-phonebook-contact-create.html';
import deleteController from './contact-delete/telecom-sms-phonebooks-phonebook-contact-delete.controller';
import deleteTemplate from './contact-delete/telecom-sms-phonebooks-phonebook-contact-delete.html';
import deletePhonebookController from './delete/telecom-sms-phonebooks-delete.controller';
import deletePhonebookTemplate from './delete/telecom-sms-phonebooks-delete.html';
import importController from './contact-import/telecom-sms-phonebooks-phonebook-contact-import.controller';
import importTemplate from './contact-import/telecom-sms-phonebooks-phonebook-contact-import.html';
import updateController from './contact-update/telecom-sms-phonebooks-phonebook-contact-update.controller';
import updateTemplate from './contact-update/telecom-sms-phonebooks-phonebook-contact-update.html';

export default class {
  /* @ngInject */
  constructor(
    $document,
    $filter,
    $q,
    $scope,
    $stateParams,
    $translate,
    $timeout,
    $uibModal,
    $window,
    OvhApiSms,
    TucToast,
    TucToastError,
    SMS_PHONEBOOKS,
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
    this.fetchPhonebooks()
      .then((phonebooks) => {
        this.phonebooks.raw = phonebooks;
        this.phonebooks.current =
          find(this.phonebooks.raw, {
            bookKey: this.$stateParams.bookKey,
          }) || head(this.phonebooks.raw);
        this.phonebookContact.isLoading = true;
        return this.fetchPhonebookContact(this.phonebooks.current)
          .then((phonebookContact) => {
            this.phonebookContact.raw = angular.copy(phonebookContact);
            this.sortPhonebookContact();
            this.updatePhonebookContactGroups();
          })
          .finally(() => {
            this.phonebookContact.isLoading = false;
          });
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant('sms_phonebooks_phonebook_ko')} ${get(
            err,
            'data.message',
          )}`,
        );
        return this.$q.rejec(err);
      })
      .finally(() => {
        this.phonebooks.isLoading = false;
      });
    this.$scope.$on('$destroy', () =>
      this.$timeout.cancel(this.phonebookContact.poller),
    );
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
      })
      .$promise.then((phonebooksIds) =>
        this.$q
          .all(
            map(
              phonebooksIds,
              (bookKey) =>
                this.api.sms.phonebooks.get({
                  serviceName: this.$stateParams.serviceName,
                  bookKey,
                }).$promise,
            ),
          )
          .then((phonebooks) => sortBy(phonebooks, 'name')),
      );
  }

  /**
   * Fetch all phonebook contact.
   * @param  {Object} phonebook
   * @return {Promise}
   */
  fetchPhonebookContact(phonebook) {
    if (!size(phonebook)) {
      return this.$q.when([]);
    }
    return this.api.sms.phonebookContact
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
                this.api.sms.phonebookContact.getBatch({
                  serviceName: this.$stateParams.serviceName,
                  bookKey: get(phonebook, 'bookKey'),
                  id,
                }).$promise,
            ),
          )
          .then((chunkResult) => {
            const result = map(flatten(chunkResult), 'value');
            const emptyGroup = get(
              this.constant.SMS_PHONEBOOKS,
              'emptyFields.group',
            );
            const emptyPhoneNumber = get(
              this.constant.SMS_PHONEBOOKS,
              'emptyFields.numbers',
            );
            return each(result, (contact) => {
              set(
                contact,
                'group',
                contact.group === emptyGroup ? '' : contact.group,
              );
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
          }),
      );
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
    if (size(this.phonebookContact.sorted) === 0) {
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
    this.phonebookContact.groupsAvailable = compact(
      uniq(
        pull(
          map(this.phonebookContact.raw, 'group'),
          get(this.constant.SMS_PHONEBOOKS, 'emptyFields.group'),
        ),
      ),
    );
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
    return filter(
      this.phonebookContact.raw,
      (contact) =>
        contact &&
        this.phonebookContact.selected &&
        this.phonebookContact.selected[contact.id],
    );
  }

  /**
   * Start phonebook edition.
   */
  startEdition() {
    this.phonebooks.current.inEdition = true;
    this.phonebooks.current.newName = angular.copy(
      this.phonebooks.current.name,
    );
    this.$timeout(() =>
      this.$document.find("input[name='phonebookName']").select(),
    );
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
    return this.api.sms.phonebooks
      .update(
        {
          serviceName: this.$stateParams.serviceName,
          bookKey: get(this.phonebooks.current, 'bookKey'),
        },
        {
          name: this.phonebooks.current.newName,
        },
      )
      .$promise.then(() => {
        this.api.sms.phonebooks.resetAllCache();
        return this.fetchPhonebooks().then((phonebooks) => {
          this.phonebooks.raw = phonebooks;
          this.phonebooks.current = find(this.phonebooks.raw, {
            name: this.phonebooks.current.newName,
          });
          return phonebooks;
        });
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'sms_phonebooks_phonebook_update_ko',
          )} ${get(err, 'data.message')}`,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
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
      template: deletePhonebookTemplate,
      controller: deletePhonebookController,
      controllerAs: 'DeleteCtrl',
      resolve: {
        phonebook: () => this.phonebooks.current,
      },
    });
    modal.result
      .then(() => {
        this.api.sms.phonebooks.resetAllCache();
        return this.fetchPhonebooks().then((phonebooks) => {
          this.phonebooks.raw = phonebooks;
          this.phonebooks.current = isEmpty(this.phonebooks.raw)
            ? {}
            : head(this.phonebooks.raw);
          return this.refresh();
        });
      })
      .catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_phonebooks_phonebook_delete_ko', {
              error: get(err, 'msg.data.message'),
            }),
          );
        }
      })
      .finally(() => {
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
      template: createTemplate,
      controller: createController,
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
    modal.result
      .then(() => this.refresh())
      .catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(
            this.$translate.instant(
              'sms_phonebooks_phonebook_contact_create_ko',
              { error: get(err, 'msg.data.message') },
            ),
          );
        }
      })
      .finally(() => {
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
      template: updateTemplate,
      controller: updateController,
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
    modal.result
      .then(() => this.refresh())
      .catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(
            this.$translate.instant(
              'sms_phonebooks_phonebook_contact_update_ko',
              { error: get(err, 'msg.data.message') },
            ),
          );
        }
      })
      .finally(() => {
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
      template: deleteTemplate,
      controller: deleteController,
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
    modal.result
      .then(() => this.refresh())
      .catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(
            this.$translate.instant(
              'sms_phonebooks_phonebook_contact_delete_ko',
              { error: get(err, 'msg.data.message') },
            ),
          );
        }
      })
      .finally(() => {
        this.phonebooks.hasModalOpened = false;
      });
  }

  /**
   * Delete all selected phonebook contact.
   * @return {Promise}
   */
  deleteSelectedPhonebookContact() {
    const contacts = this.getSelection();
    const queries = contacts.map(
      (contact) =>
        this.api.sms.phonebookContact.delete({
          serviceName: this.$stateParams.serviceName,
          bookKey: get(this.phonebooks.current, 'bookKey'),
          id: contact.id,
        }).$promise,
    );
    this.phonebookContact.isDeleting = true;
    queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
    this.TucToast.info(
      this.$translate.instant(
        'sms_phonebooks_phonebook_contact_selected_delete_info',
      ),
    );
    return this.$q
      .all(queries)
      .then(() => {
        this.phonebookContact.selected = {};
        return this.refresh();
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant(
            'sms_phonebooks_phonebook_contact_selected_delete_ko',
            { error: get(err, 'data.message') },
          ),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
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
      template: importTemplate,
      controller: importController,
      controllerAs: 'ContactImportCtrl',
      resolve: {
        phonebook: () => this.phonebooks.current,
      },
    });
    modal.result
      .then((response) => {
        if (has(response, 'taskId')) {
          this.phonebookContact.isImporting = true;
          return this.api.sms.task
            .poll(this.$scope, {
              serviceName: this.$stateParams.serviceName,
              taskId: response.taskId,
            })
            .finally(() => {
              this.phonebookContact.isImporting = false;
              return this.refresh();
            });
        }
        return response;
      })
      .catch((err) => {
        if (err && err.type === 'API') {
          this.TucToast.error(
            this.$translate.instant(
              'sms_phonebooks_phonebook_contact_import_ko',
              { error: get(err, 'msg.data.message') },
            ),
          );
        }
      })
      .finally(() => {
        this.phonebooks.hasModalOpened = false;
      });
  }

  /**
   * Export phonebook contact.
   * @return {Promise}
   */
  exportPhonebookContact() {
    this.phonebookContact.isExporting = true;
    const tryGetCsvExport = () =>
      this.api.sms.phonebooks
        .getExport({
          serviceName: this.$stateParams.serviceName,
          bookKey: get(this.phonebooks.current, 'bookKey'),
          format: 'csv',
        })
        .$promise.then((exportPhonebook) => {
          if (exportPhonebook.status === 'done') {
            return exportPhonebook;
          }
          this.phonebookContact.poller = this.$timeout(tryGetCsvExport, 1000);
          return this.phonebookContact.poller;
        });
    return tryGetCsvExport()
      .then((phonebook) => {
        this.$window.location.href = phonebook.url;
        this.TucToast.success(
          this.$translate.instant('sms_phonebooks_phonebook_contact_export_ok'),
        );
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'sms_phonebooks_phonebook_contact_export_ko',
          )} ${get(err, 'data.message')}`,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
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
    return this.fetchPhonebookContact(this.phonebooks.current)
      .then((phonebookContact) => {
        this.phonebookContact.raw = angular.copy(phonebookContact);
        this.sortPhonebookContact();
        this.updatePhonebookContactGroups();
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'sms_phonebooks_phonebook_contact_ko',
          )} ${get(err, 'data.message')}`,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.phonebookContact.isLoading = false;
      });
  }
}
