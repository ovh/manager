import get from 'lodash/get';
import isObject from 'lodash/isObject';

angular.module('managerApp').controller(
  'TelecomTelephonyAliasRecordsCtrl',
  class TelecomTelephonyAliasRecordsCtrl {
    constructor(
      $q,
      $state,
      $stateParams,
      $timeout,
      $translate,
      $uibModal,
      TucToast,
      tucVoipServiceAlias,
      TELEPHONY_ALIAS_CONTACT_CENTER_SOLUTION,
    ) {
      this.$q = $q;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.$uibModal = $uibModal;
      this.TucToast = TucToast;
      this.tucVoipServiceAlias = tucVoipServiceAlias;
      this.TELEPHONY_ALIAS_CONTACT_CENTER_SOLUTION = TELEPHONY_ALIAS_CONTACT_CENTER_SOLUTION;
    }

    $onInit() {
      this.loading = true;
      this.serviceInfos = {
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
      };

      this.recordsGuideUrl = this.TELEPHONY_ALIAS_CONTACT_CENTER_SOLUTION.recordsGuideUrl;

      this.recordDisablingLanguageOptions = this.TELEPHONY_ALIAS_CONTACT_CENTER_SOLUTION.records.languages.map(
        ({ id, code }) => ({
          id,
          label: this.$translate.instant(`language_${code}`),
        }),
      );

      this.recordDisablingDigitOptions = this.TELEPHONY_ALIAS_CONTACT_CENTER_SOLUTION.records.digits;

      return this.$q
        .all({
          queues: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberQueues(
            this.serviceInfos,
          ),
          records: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberRecords(
            this.serviceInfos,
          ),
        })
        .then(({ queues, records }) => {
          [this.queue] = queues;
          this.records = records;

          this.copyQueue = angular.copy(this.queue);

          [this.recordDisablingLanguage] = this.recordDisablingLanguageOptions;
          [this.recordDisablingDigit] = this.recordDisablingDigitOptions;

          if (this.queue.recordDisablingDigit) {
            this.recordDisablingDigit = this.queue.recordDisablingDigit;
          }

          if (this.queue.recordDisablingLanguage) {
            this.recordDisablingLanguage = this.recordDisablingLanguageOptions.find(
              ({ id }) => id === this.queue.recordDisablingLanguage,
            );
          }
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_contactCenterSolution_records_get_error',
            )} ${get(error, 'data.message', '')}`,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    deleteRecords(selectedRecords) {
      this.$uibModal
        .open({
          templateUrl:
            'app/telecom/telephony/alias/records/delete/telecom-telephony-alias-records-delete.html',
          controller: 'TelecomTelephonyAliasRecordsDeleteCtrl',
          controllerAs: '$ctrl',
          resolve: {
            itemCount: selectedRecords.length,
          },
        })
        .result.then(() =>
          this.$q.all(
            selectedRecords.map(({ id }) =>
              this.tucVoipServiceAlias.deleteContactCenterSolutionNumberRecord(
                this.serviceInfos,
                id,
              ),
            ),
          ),
        )
        .then(() => this.$onInit())
        .then(() => {
          this.TucToast.success(
            this.$translate.instant(
              'telephony_alias_contactCenterSolution_records_delete_success',
            ),
          );
        })
        .catch((error) => {
          if (isObject(error)) {
            this.TucToast.error(
              `${this.$translate.instant(
                'telephony_alias_contactCenterSolution_records_delete_error',
              )} ${get(error, 'data.message', '')}`,
            );
          }
        });
    }

    canUpdateQueueSettings() {
      return !angular.equals(this.queue, this.copyQueue);
    }

    updateQueueSettings() {
      this.loading = true;
      this.queue.recordDisablingDigit = this.queue.askForRecordDisabling
        ? this.recordDisablingDigit
        : null;
      this.queue.recordDisablingLanguage = this.queue.askForRecordDisabling
        ? this.recordDisablingLanguage.id
        : null;

      return this.tucVoipServiceAlias
        .updateContactCenterSolutionNumberQueue(this.serviceInfos, this.queue)
        .then(() => this.$onInit())
        .then(() => {
          this.TucToast.success(
            this.$translate.instant(
              'telephony_alias_contactCenterSolution_records_update_queue_success',
            ),
          );
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_contactCenterSolution_records_update_queue_error',
            )} ${get(error, 'data.message', '')}`,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    downloadRecords(records) {
      return records.reduce(
        (promise, { fileUrl }) =>
          promise.then(() =>
            this.$timeout(() => {
              window.location = fileUrl;
            }, 300),
          ),
        this.$q.when(),
      );
    }
  },
);
