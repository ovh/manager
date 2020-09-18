import get from 'lodash/get';
import moment from 'moment';

export default class SmsBatchesHistoryController {
  /* @ngInject */
  constructor($http, $q, SmsService) {
    this.$http = $http;
    this.$q = $q;
    this.SmsService = SmsService;
  }

  cancelBatches(selectedBatches) {
    this.isCanceling = true;

    return this.$q
      .all(
        selectedBatches
          .filter(({ status }) => this.canBeCancelled(status))
          .map(({ id }) => this.cancelBatch(id)),
      )
      .then(() => this.refreshBatches())
      .then(() => {
        this.hasCanceled = true;
      })
      .catch((error) => {
        this.error = get(error, 'data.message', error.message);
      })
      .finally(() => {
        this.isCanceling = false;
      });
  }

  canBeCancelled(status) {
    return ![
      this.batchStatuses.CANCELING,
      this.batchStatuses.TO_CANCEL,
    ].includes(status);
  }

  downloadLogs(batch) {
    this.isDownloading = true;

    return this.SmsService.getDocument(
      this.serviceName,
      moment(batch.createdAt).format(),
      moment().format(),
      batch.id,
    )
      .catch((error) => {
        this.error = get(error, 'data.message', error.message);
      })
      .finally(() => {
        this.isDownloading = false;
      });
  }

  refreshBatches() {
    return this.getBatches().then((batches) => {
      this.batches = batches;
    });
  }
}
