import angular from 'angular';
import endsWith from 'lodash/endsWith';
import find from 'lodash/find';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';

import template from './telecom-telephony-callsFilteringAdd.html';
import templateOpenHelper from './addHelper/telecom-telephony-callsFilteringAddHelper.html';

export default /* @ngInject */ {
  bindings: {
    addScreenList: '&', // function to add a given screen
    getScreenList: '&', // function to retrieve the list of existing screens
    onScreenListAdded: '&?', // callback for when one or multiple screens have been added
    disableOutgoing: '@',
    disableNature: '@',
  },
  template,
  controller($q, $translate, $uibModal, TucToast, TucToastError, TucCsvParser) {
    'ngInject';

    const self = this;

    self.screenListToAdd = {
      nature: 'international',
      type: 'incomingWhiteList',
      callNumber: '',
    };

    self.isAdding = false;

    self.$onInit = function $onInit() {
      self.isInitialized = true;
    };

    self.addScreen = function addScreen(form) {
      self.isAdding = true;
      if (self.screenListToAdd.callNumber === null) {
        self.screenListToAdd.callNumber = '';
      }
      if (self.isScreenListsAlreadyExisting()) {
        return $q.when(false);
      }
      return self
        .addScreenList({
          screen: self.screenListToAdd,
        })
        .then(() => {
          if (self.onScreenListAdded) {
            self.onScreenListAdded();
          }
          form.$setPristine();
          self.screenListToAdd.callNumber = '';
          TucToast.success(
            $translate.instant('telephony_calls_filtering_add_success'),
          );
        })
        .catch((err) => new TucToastError(err))
        .finally(() => {
          self.isAdding = false;
        });
    };

    self.isScreenListsAlreadyExisting = function isScreenListsAlreadyExisting() {
      const list = self.getScreenList();
      let found = find(list, {
        callNumber: self.screenListToAdd.callNumber || '',
        nature: self.screenListToAdd.nature,
        type: self.screenListToAdd.type,
      });

      // try to find the screenlist by modifying callNumber because +123 === 00123
      if (!found && self.screenListToAdd.callNumber) {
        let modifiedCallNumber = self.screenListToAdd.callNumber;
        if (startsWith(self.screenListToAdd.callNumber, '+')) {
          modifiedCallNumber = `00${self.screenListToAdd.callNumber.slice(1)}`;
        } else if (startsWith(self.screenListToAdd.callNumber, '00')) {
          modifiedCallNumber = `+${self.screenListToAdd.callNumber.slice(2)}`;
        }
        if (modifiedCallNumber !== self.screenListToAdd.callNumber) {
          found = find(list, {
            callNumber: modifiedCallNumber,
            nature: self.screenListToAdd.nature,
            type: self.screenListToAdd.type,
          });
        }
      }
      return angular.isDefined(found) && found.status !== 'delete';
    };

    self.checkValidCSV = function checkValidCSV(file) {
      const fileName = file ? file.name : '';
      const found = endsWith(fileName, 'csv');
      if (!found) {
        TucToastError(
          $translate.instant('telephony_calls_filtering_add_csv_invalid'),
        );
      }
      return found;
    };

    self.importCSV = function importCSV(csvData) {
      let csvArray = null;
      try {
        csvArray = TucCsvParser.parse(csvData);

        // check if csv header is valid otherwise raise an error
        if (!angular.equals(csvArray[0], ['callNumber', 'nature', 'type'])) {
          throw new Error('Invalid CSV header');
        }
        csvArray = csvArray.slice(1); // trim header
      } catch (err) {
        return $q.when(
          new TucToastError(
            $translate.instant('telephony_calls_filtering_add_csv_parse_error'),
            err,
          ),
        );
      }
      TucToast.info(
        $translate.instant('telephony_calls_filtering_add_csv_import_success'),
      );
      return $q
        .all(
          map(csvArray, (line) =>
            self.addScreenList({
              screen: {
                callNumber: line[0],
                nature: line[1],
                type: line[2],
              },
            }),
          ),
        )
        .then(() => {
          if (self.onScreenListAdded) {
            self.onScreenListAdded();
          }
        })
        .catch((err) => new TucToastError(err));
    };

    self.getNumberValidationPattern = (function getNumberValidationPattern() {
      const shortNumber = /^[0-9]+$/;
      const internationalNumber = /^(\+|00)[0-9]+$/;
      const validAll = /.*/;
      return function getNumberValidationPatternFunc() {
        if (self.disableNature) {
          return validAll;
        }
        return self.screenListToAdd.nature === 'special'
          ? shortNumber
          : internationalNumber;
      };
    })();

    self.openHelper = function openHelper() {
      self.helperModalOpened = true;
      const modal = $uibModal.open({
        animation: true,
        template: templateOpenHelper,
        controller: 'tucTelecomTelephonyCallsFilteringAddHelperCtrl',
        controllerAs: 'FilteringHelperCtrl',
        resolve: {
          param() {
            return {
              addScreenList: self.addScreenList,
              disableOutgoing: self.disableOutgoing,
            };
          },
        },
      });
      modal.result
        .then(() => {
          if (self.onScreenListAdded) {
            self.onScreenListAdded();
          }
        })
        .finally(() => {
          self.helperModalOpened = false;
        });
      return modal;
    };
  },
};
