import assign from 'lodash/assign';
import endsWith from 'lodash/endsWith';
import pick from 'lodash/pick';
import snakeCase from 'lodash/snakeCase';
import some from 'lodash/some';

angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyLineTonesCtrl',
    function TelecomTelephonyLineTonesCtrl(
      $state,
      $stateParams,
      $q,
      $timeout,
      $translate,
      OvhApiTelephony,
      TucToastError,
      OvhApiMe,
      TelephonyMediator,
    ) {
      const self = this;
      const disabledFeatureError = {};

      function checkIfFeatureEnabled() {
        return TelephonyMediator.getGroup($stateParams.billingAccount)
          .then((group) => group.getLine($stateParams.serviceName))
          .then((line) => {
            if (line.isIndividual()) {
              $state.go('telecom.telephony.billingAccount.line.dashboard');
              return $q.reject(disabledFeatureError);
            }
            return line;
          });
      }

      function fetchTones() {
        return OvhApiTelephony.Line()
          .v6()
          .getTones({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
          }).$promise;
      }

      function init() {
        self.isLoading = true;
        return checkIfFeatureEnabled()
          .then(
            fetchTones().then((tones) => {
              self.tonesEnum = [
                'None',
                'Predefined 1',
                'Predefined 2',
                'Custom sound',
              ];
              self.tones = tones;
              self.tonesForm = angular.copy(self.tones);
            }),
          )
          .catch((err) =>
            err === disabledFeatureError ? err : new TucToastError(err),
          )
          .finally(() => {
            self.isLoading = false;
          });
      }

      self.getToneTypeLabel = function getToneTypeLabel(toneType) {
        let label = '';
        if (angular.isString(toneType)) {
          const toneId = snakeCase(toneType);
          label = $translate.instant(`telephony_line_tones_type_${toneId}`);
        }
        return label;
      };

      self.filterValidExtension = function filterValidExtension(file) {
        const validExtensions = [
          'aiff',
          'au',
          'flac',
          'ogg',
          'mp3',
          'wav',
          'wma',
        ];
        const fileName = file ? file.name : '';
        const found = some(validExtensions, (ext) =>
          endsWith(fileName.toLowerCase(), ext),
        );
        if (!found) {
          TucToastError(
            $translate.instant('telephony_line_tones_choose_file_type_error'),
          );
        }
        return found;
      };

      self.updateTone = function updateTone(toneType) {
        // only update tone if it is not a file upload and if tone changed
        if (
          self.tonesForm[toneType] !== 'Custom sound' &&
          self.tonesForm[toneType] !== self.tones[toneType]
        ) {
          const tonesParam = self.tones;
          assign(tonesParam, pick(self.tonesForm, toneType));
          self.tonesForm[`${toneType}Updating`] = true;
          return $q
            .all([
              $timeout(angular.noop, 500), // avoid clipping
              OvhApiTelephony.Line()
                .v6()
                .changeTones(
                  {
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                  },
                  tonesParam,
                )
                .$promise.then(() => {
                  // since there are no errors, assume tone is correctly updated
                  self.tones[toneType] = self.tonesForm[toneType];
                }),
            ])
            .catch((err) => new TucToastError(err))
            .finally(() => {
              self.tonesForm[`${toneType}Updating`] = false;
            });
        }
        return $q.when(true);
      };

      self.uploadTone = function uploadTone(toneType) {
        self.tonesForm[`${toneType}Uploading`] = true;

        // upload document
        return OvhApiMe.Document()
          .v6()
          .upload(
            self.tonesForm[`${toneType}File`].name,
            self.tonesForm[`${toneType}File`],
          )
          .then(
            (doc) =>
              OvhApiTelephony.Line()
                .v6()
                .toneUpload(
                  {
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                  },
                  {
                    type: toneType,
                    documentId: doc.id,
                  },
                ).$promise,
          )
          .then(() => {
            self.tonesForm[`${toneType}UploadSuccess`] = true;

            // since there are no errors, assume tone is correctly updated
            self.tones[toneType] = self.tonesForm[toneType];
            $timeout(() => {
              self.tonesForm[`${toneType}File`] = null;
              self.tonesForm[`${toneType}UploadSuccess`] = false;
            }, 3000);
          })
          .catch((err) => new TucToastError(err))
          .finally(() => {
            self.tonesForm[`${toneType}Uploading`] = false;
          });
      };

      init();
    },
  );
