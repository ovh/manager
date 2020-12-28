import assign from 'lodash/assign';
import chunk from 'lodash/chunk';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import map from 'lodash/map';
import pick from 'lodash/pick';
import set from 'lodash/set';
import size from 'lodash/size';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import pull from 'lodash/pull';

import contactAddController from './contact-add/contact-add.controller';
import contactAddTemplate from './contact-add/contact-add.html';

import contactImportController from './contact-import/contact-import.controller';
import contactImporTemplate from './contact-import/contact-import.html';

import contactUpdateController from './contact-update/contact-update.controller';
import contactUpdateTemplate from './contact-update/contact-update.html';

import removeController from './remove/remove.controller';
import removeTemplate from './remove/remove.html';

export default /* @ngInject */ function TelecomTelephonyBillingAccountPhonebookCtrl(
  $document,
  $filter,
  $q,
  $scope,
  $stateParams,
  $timeout,
  $translate,
  $uibModal,
  $window,
  OvhApiTelephony,
  tucVoipServiceTask,
  TucToast,
  TucToastError,
  TUC_TELEPHONY_PHONEBOOK,
) {
  const self = this;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function fetchPhonebook() {
    return OvhApiTelephony.Phonebook()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((phonebookIds) => {
        if (size(phonebookIds)) {
          return OvhApiTelephony.Phonebook()
            .v6()
            .get({
              billingAccount: $stateParams.billingAccount,
              bookKey: head(phonebookIds),
            }).$promise;
        }
        return null;
      });
  }

  function fetchPhonebookContact(bookKey) {
    return OvhApiTelephony.Phonebook()
      .PhonebookContact()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        bookKey,
      })
      .$promise.then((phonebookContactIds) =>
        $q
          .all(
            map(
              chunk(phonebookContactIds, 50),
              (chunkIds) =>
                OvhApiTelephony.Phonebook()
                  .PhonebookContact()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    bookKey,
                    id: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => {
            const result = map(flatten(chunkResult), 'value');
            const emptyGroup = get(
              TUC_TELEPHONY_PHONEBOOK,
              'emptyFields.group',
            );
            const emptyPhoneNumber = get(
              TUC_TELEPHONY_PHONEBOOK,
              'emptyFields.numbers',
            );
            return forEach(result, (contact) => {
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

  self.getSelection = function getSelection() {
    return filter(
      self.phonebookContact.raw,
      (contact) =>
        contact &&
        self.phonebookContact.selected &&
        self.phonebookContact.selected[contact.id],
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  /* ----------  PHONEBOOK  ----------*/

  self.createPhonebook = function createPhonebook(form) {
    self.phonebookToAdd.isAdding = true;
    const name = pick(self.phonebookToAdd, 'name');
    return OvhApiTelephony.Phonebook()
      .v6()
      .create(
        {
          billingAccount: $stateParams.billingAccount,
        },
        name,
      )
      .$promise.then((phonebook) => {
        form.$setPristine();
        assign(self.phonebook, pick(phonebook, ['bookKey']), name);
        TucToast.success(
          $translate.instant('telephony_phonebook_create_success'),
        );
      })
      .catch((error) => new TucToastError(error))
      .finally(() => {
        self.phonebookToAdd.isAdding = false;
      });
  };

  self.startEdition = function startEdition() {
    self.phonebook.inEdition = true;
    self.phonebook.newName = angular.copy(self.phonebook.name);
    $timeout(() => {
      $document.find("input[name='phonebookName']").select();
    });
  };

  self.cancelEdition = function cancelEdition() {
    self.phonebook.inEdition = false;
  };

  self.savePhonebook = function savePhonebook() {
    return OvhApiTelephony.Phonebook()
      .v6()
      .update(
        {
          billingAccount: $stateParams.billingAccount,
          bookKey: self.phonebook.bookKey,
        },
        {
          name: self.phonebook.newName,
        },
      )
      .$promise.then(() => {
        self.phonebook.name = self.phonebook.newName;
      })
      .catch((error) => {
        TucToast.error(
          $translate.instant('telephony_phonebook_update_ko', {
            error: get(error, 'data.message'),
          }),
        );
      })
      .finally(() => {
        self.phonebook.inEdition = false;
      });
  };

  self.deletePhonebook = function deletePhonebook() {
    self.phonebook.hasModalOpened = true;
    const modal = $uibModal.open({
      animation: true,
      template: removeTemplate,
      controller: removeController,
      controllerAs: 'PhonebookRemoveCtrl',
      resolve: {
        phonebook() {
          return self.phonebook;
        },
      },
    });
    modal.result
      .then(
        () => {
          self.phonebook.name = null;
          self.phonebook.bookKey = null;
          self.phonebookContact.raw = [];
          self.phonebookContact.groupsAvailable = [];
          self.sortPhonebookContact();
        },
        (error) => {
          if (error && error.type === 'API') {
            TucToast.error(
              $translate.instant('telephony_phonebook_delete_ko', {
                error: get(error, 'msg.data.message'),
              }),
            );
          }
        },
      )
      .finally(() => {
        self.phonebook.hasModalOpened = false;
      });
  };

  /* ----------  PHONEBOOK CONTACT  ----------*/

  self.addPhonebookContact = function addPhonebookContact() {
    self.phonebookContact.hasModalOpened = true;
    const modal = $uibModal.open({
      animation: true,
      template: contactAddTemplate,
      controller: contactAddController,
      controllerAs: 'ContactAddCtrl',
      resolve: {
        data() {
          return {
            phonebook: self.phonebook,
            groupsAvailable: self.phonebookContact.groupsAvailable,
          };
        },
      },
    });
    modal.result
      .then(
        () => self.refresh(),
        (error) => {
          if (error && error.type === 'API') {
            TucToast.error(
              $translate.instant('telephony_phonebook_contact_add_ko', {
                error: get(error, 'msg.data.message'),
              }),
            );
          }
        },
      )
      .finally(() => {
        self.phonebookContact.hasModalOpened = false;
      });
  };

  self.importPhonebookContact = function importPhonebookContact() {
    self.phonebookContact.hasModalOpened = true;
    const modal = $uibModal.open({
      animation: true,
      template: contactImporTemplate,
      controller: contactImportController,
      controllerAs: 'ContactImportCtrl',
      resolve: {
        bookKey() {
          return get(self.phonebook, 'bookKey');
        },
      },
    });
    modal.result
      .then((response) => {
        if (has(response, 'taskId')) {
          self.phonebookContact.isImporting = true;
          return tucVoipServiceTask
            .startPolling(
              $stateParams.billingAccount,
              $stateParams.serviceName,
              response.taskId,
              {
                namespace: `billingAccountPhonebookContactImportTask_${$stateParams.serviceName}`,
                interval: 1000,
                retryMaxAttempts: 2,
              },
            )
            .catch((err) => {
              if (err.status === 404) {
                self.phonebookContact.isImporting = false;
                return self.refresh();
              }
              TucToast.error(
                [
                  $translate.instant(
                    'telephony_number_feature_redirect_save_error',
                  ),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
              return $q.reject(err);
            });
        }
        return null;
      })
      .catch((err) => {
        if (err && err.type === 'API') {
          TucToast.error(
            $translate.instant('telephony_phonebook_contact_action_import_ko', {
              error: get(err, 'msg.data.message'),
            }),
          );
        }
      })
      .finally(() => {
        self.phonebookContact.hasModalOpened = false;
      });
    return modal;
  };

  self.exportPhonebookContact = function exportPhonebookContact() {
    self.phonebookContact.isExporting = true;
    const tryGetCsvExport = function tryGetCsvExport() {
      return OvhApiTelephony.Phonebook()
        .v6()
        .getExport({
          billingAccount: $stateParams.billingAccount,
          bookKey: get(self.phonebook, 'bookKey'),
          format: 'csv',
        })
        .$promise.then((exportPhonebook) => {
          if (exportPhonebook.status === 'done') {
            return exportPhonebook;
          }
          if (self.phonebookContact.poller) {
            $timeout.cancel(self.phonebookContact.poller);
          }
          self.phonebookContact.poller = $timeout(tryGetCsvExport, 1000);
          return self.phonebookContact.poller;
        });
    };
    return tryGetCsvExport()
      .then((phonebook) => {
        // eslint-disable-next-line no-param-reassign
        $window.location.href = phonebook.url;
        TucToast.success(
          $translate.instant('telephony_phonebook_contact_action_export_ok'),
        );
      })
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant('telephony_phonebook_contact_action_export_ko'),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
        return $q.reject(err);
      })
      .finally(() => {
        self.phonebookContact.isExporting = false;
      });
  };

  self.updatePhonebookContact = function updatePhonebookContact(contact) {
    self.phonebookContact.hasModalOpened = true;
    const modal = $uibModal.open({
      animation: true,
      template: contactUpdateTemplate,
      controller: contactUpdateController,
      controllerAs: 'ContactUpdateCtrl',
      resolve: {
        data() {
          return {
            phonebook: self.phonebook,
            contact,
            groupsAvailable: self.phonebookContact.groupsAvailable,
          };
        },
      },
    });
    modal.result
      .then(
        () => self.refresh(),
        (error) => {
          if (error && error.type === 'API') {
            TucToast.error(
              $translate.instant('telephony_phonebook_contact_update_ko', {
                error: get(error, 'msg.data.message'),
              }),
            );
          }
        },
      )
      .finally(() => {
        self.phonebookContact.hasModalOpened = false;
      });
  };

  self.removePhonebookContact = function removePhonebookContact(contact) {
    self.phonebookContact.isDeleting = true;
    return OvhApiTelephony.Phonebook()
      .PhonebookContact()
      .v6()
      .remove({
        billingAccount: $stateParams.billingAccount,
        bookKey: self.phonebook.bookKey,
        id: contact.id,
      })
      .$promise.then(() => {
        TucToast.success(
          $translate.instant('telephony_phonebook_contact_remove_success'),
        );
        return self.refresh();
      })
      .catch((error) => new TucToastError(error))
      .finally(() => {
        self.phonebookContact.isDeleting = false;
      });
  };

  self.deleteSelectedContacts = function deleteSelectedContacts() {
    const contacts = self.getSelection();
    const queries = contacts.map(
      (contact) =>
        OvhApiTelephony.Phonebook()
          .PhonebookContact()
          .v6()
          .remove({
            billingAccount: $stateParams.billingAccount,
            bookKey: get(self.phonebook, 'bookKey'),
            id: contact.id,
          }).$promise,
    );
    self.phonebookContact.isDeleting = true;
    queries.push($timeout(angular.noop, 500)); // avoid clipping
    TucToast.info($translate.instant('telephony_phonebook_delete_success'));
    return $q
      .all(queries)
      .then(() => {
        self.phonebookContact.selected = {};
        return self.refresh();
      })
      .catch((error) => new TucToastError(error))
      .finally(() => {
        self.phonebookContact.isDeleting = false;
      });
  };

  self.sortPhonebookContact = function sortPhonebookContact() {
    let data = angular.copy(self.phonebookContact.raw);
    data = $filter('orderBy')(
      data,
      self.phonebookContact.orderBy,
      self.phonebookContact.orderDesc,
    );
    self.phonebookContact.sorted = data;

    // avoid pagination bug…
    if (self.phonebookContact.sorted.length === 0) {
      self.phonebookContact.paginated = [];
    }
  };

  self.orderPhonebookContactBy = function orderPhonebookContactBy(by) {
    if (self.phonebookContact.orderBy === by) {
      self.phonebookContact.orderDesc = !self.phonebookContact.orderDesc;
    } else {
      self.phonebookContact.orderBy = by;
    }
    self.sortPhonebookContact();
  };

  self.updatePhonebookContactGroups = function updatePhonebookContactGroups() {
    self.phonebookContact.groupsAvailable = compact(
      uniq(pull(map(self.phonebookContact.raw, 'group'), 'No group')),
    );
  };

  self.refresh = function refresh() {
    self.phonebookContact.isLoading = true;
    OvhApiTelephony.Phonebook()
      .PhonebookContact()
      .v6()
      .resetAllCache();
    return fetchPhonebookContact(self.phonebook.bookKey)
      .then((phonebookContact) => {
        self.phonebookContact.raw = phonebookContact;
        self.sortPhonebookContact();
        self.updatePhonebookContactGroups();
      })
      .catch((error) => new TucToastError(error))
      .finally(() => {
        self.phonebookContact.isLoading = false;
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.phonebook = {
      name: null,
      bookKey: null,
      isLoading: false,
      hasModalOpened: false,
      inEdition: false,
    };
    self.phonebookToAdd = {
      name: '',
      isAdding: false,
    };
    self.phonebookContact = {
      raw: [],
      groupsAvailable: [],
      paginated: null,
      sorted: null,
      selected: {},
      orderBy: 'name',
      orderDesc: false,
      isLoading: false,
      isAdding: false,
      isImporting: false,
      isExporting: false,
      isDeleting: false,
      hasModalOpened: false,
      poller: null,
    };
    self.phonebook.isLoading = true;
    return fetchPhonebook()
      .then((phonebook) => {
        if (phonebook) {
          assign(self.phonebook, phonebook);
          return fetchPhonebookContact(self.phonebook.bookKey).then(
            (phonebookContact) => {
              self.phonebookContact.raw = phonebookContact;
              self.sortPhonebookContact();
              self.updatePhonebookContactGroups();
            },
          );
        }
        return null;
      })
      .catch((error) => new TucToastError(error))
      .finally(() => {
        self.phonebook.isLoading = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();

  $scope.$on('$destroy', () => {
    $timeout.cancel(self.phonebookContact.poller);
  });
}
