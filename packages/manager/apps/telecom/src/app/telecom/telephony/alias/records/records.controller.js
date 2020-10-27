import get from 'lodash/get';
import isObject from 'lodash/isObject';

import deleteTemplate from './delete/delete.html';
import deleteController from './delete/delete.controller';

import {
  RECORDS,
  RECORDS_GUIDE_URL,
} from '../configuration/feature/contactCenterSolution/contact-center-solution.constants';

export default class TelecomTelephonyAliasRecordsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $uibModal,
    TucToast,
    tucVoipServiceAlias,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.TucToast = TucToast;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
  }

  $onInit() {
    this.loading = true;
    this.serviceInfos = {
      billingAccount: this.$stateParams.billingAccount,
      serviceName: this.$stateParams.serviceName,
    };

    this.recordsGuideUrl = RECORDS_GUIDE_URL;

    this.recordDisablingLanguageOptions = RECORDS.languages.map(
      ({ id, code }) => ({
        id,
        label: this.$translate.instant(`language_${code}`),
      }),
    );

    this.recordDisablingDigitOptions = RECORDS.digits;

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
        template: deleteTemplate,
        controller: deleteController,
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
}
