import angular from 'angular';
import pick from 'lodash/pick';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';

import template from './telecom-telephony-abbreviated-numbers.html';
import templateAddOrUpdate from './telecom-telephony-abbreviated-numbers.modal.html';
import templateImport from './import/telecom-telephony-abbreviated-numbers-import.modal.html';
import templateTrashAll from './empty/telecom-telephony-abbreviated-numbers-empty.modal.html';

export default {
  bindings: {
    abbreviatedNumbers: '=?',
    abbreviatedNumberPattern: '=?',
    loading: '=?',
    exportFilename: '=?',
    removeCallback: '&',
    insertCallback: '&',
    updateCallback: '&',
    reloadCallback: '&',
  },
  template,
  controller($uibModal, $q, $translate, TucToast, PAGINATION_PER_PAGE) {
    'ngInject';

    const self = this;

    this.$onInit = function $onInit() {
      self.filter = {
        perPage: PAGINATION_PER_PAGE,
      };
      self.loading = {
        init: true,
      };
      self.abbreviatedNumbers = undefined;
    };

    /**
     * Remove an abbreviated number from the list
     * @param  {Object} abbreviatedNumber Full object
     * @return {Promise}
     */
    this.remove = function remove(abbreviatedNumber) {
      return $q
        .when(this.removeCallback({ value: abbreviatedNumber }))
        .then(() => {
          TucToast.success(
            $translate.instant(
              'telephony_abbreviated_numbers_remove_success',
              abbreviatedNumber,
            ),
          );
          const index = self.abbreviatedNumbers.findIndex(
            ({ abbreviatedNumber: number }) =>
              number === abbreviatedNumber.abbreviatedNumber,
          );
          self.abbreviatedNumbers.splice(index, 1);
        })
        .catch((err) => {
          TucToast.error(
            $translate.instant(
              'telephony_abbreviated_numbers_remove_error',
              abbreviatedNumber,
            ),
          );
          return $q.reject(err);
        });
    };

    /**
     * Add a new abbreviated number
     */
    this.add = function add() {
      const addModalInstance = $uibModal.open({
        animation: true,
        template: templateAddOrUpdate,
        controller: 'tucTelecomTelephonyAbbreviatedNumbersModal',
        controllerAs: 'AbbreviatedNumberModal',
        resolve: {
          data() {
            return {
              // data: {},
              pattern: self.abbreviatedNumberPattern,
              saveCallback: self.insertCallback,
              title: $translate.instant(
                'telephony_abbreviated_numbers_insert_title',
              ),
            };
          },
        },
      });
      addModalInstance.result.then((data) => {
        self.abbreviatedNumbers.push(data);
        self.abbreviatedNumbers = sortBy(self.abbreviatedNumbers, (elt) =>
          parseInt(elt.abbreviatedNumber, 10),
        );
      });
    };

    /**
     * Open the import dialog
     */
    this.openImport = function openImport() {
      const importModalInstance = $uibModal.open({
        animation: true,
        template: templateImport,
        controller: 'tucTelecomTelephonyAbbreviatedNumbersImportModal',
        controllerAs: 'AbbreviatedNumberModal',
        resolve: {
          data() {
            return {
              pattern: self.abbreviatedNumberPattern,
              saveCallback: self.insertCallback,
            };
          },
        },
      });
      importModalInstance.result.then((data) => {
        self.abbreviatedNumbers = sortBy(
          self.abbreviatedNumbers.concat(data),
          (elt) => parseInt(elt.abbreviatedNumber, 10),
        );
      });
      importModalInstance.result.catch(() => {
        self.reloadCallback();
      });
    };

    /**
     * Open the "Trash All" dialog
     */
    this.trashAll = function trashAll() {
      const importModalInstance = $uibModal.open({
        animation: true,
        template: templateTrashAll,
        controller: 'tucTelecomTelephonyAbbreviatedNumbersEmptyModal',
        controllerAs: 'AbbreviatedNumberModal',
        resolve: {
          data() {
            return {
              abbreviatedNumbers: self.abbreviatedNumbers,
              removeCallback: self.removeCallback,
            };
          },
        },
      });
      importModalInstance.result.then(() => {
        self.reloadCallback();
      });
      importModalInstance.result.catch(() => {
        self.reloadCallback();
      });
    };

    /**
     * Get the header line of the CSV
     */
    this.getCsvHeader = function getCsvHeader() {
      return {
        abbreviatedNumber: $translate.instant(
          'telephony_abbreviated_numbers_id',
        ),
        destinationNumber: $translate.instant(
          'telephony_abbreviated_numbers_number',
        ),
        name: $translate.instant('telephony_abbreviated_numbers_name'),
        surname: $translate.instant('telephony_abbreviated_numbers_surname'),
      };
    };

    /**
     * Get the order of fields in the CSV
     */
    this.getCsvOrder = function getCsvOrder() {
      return ['abbreviatedNumber', 'destinationNumber', 'name', 'surname'];
    };

    /**
     * Update an abbreviated number
     * @param  {Object} abbreviatedNumber Abbreviated number to update
     */
    this.update = function update(abbreviatedNumber) {
      set(abbreviatedNumber, 'updating', true);
      const addModalInstance = $uibModal.open({
        animation: true,
        template: templateAddOrUpdate,
        controller: 'tucTelecomTelephonyAbbreviatedNumbersModal',
        controllerAs: 'AbbreviatedNumberModal',
        resolve: {
          data() {
            return {
              data: angular.copy(abbreviatedNumber),
              readOnly: {
                abbreviatedNumber: true,
              },
              pattern: self.abbreviatedNumberPattern,
              saveCallback: self.updateCallback,
              title: $translate.instant(
                'telephony_abbreviated_numbers_update_title',
              ),
            };
          },
        },
      });
      addModalInstance.result
        .then((data) => {
          angular.extend(
            abbreviatedNumber,
            pick(data, ['name', 'surname', 'destinationNumber']),
          );
        })
        .finally(() => {
          // eslint-disable-next-line no-param-reassign
          delete abbreviatedNumber.updating;
        });
    };
  },
};
