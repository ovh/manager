import get from 'lodash/get';
import moment from 'moment';

import { DOWNLOAD_HIT } from './telecom-sms-batches-history.constants';

export default class SmsBatchesHistoryController {
  /* @ngInject */
  constructor(SmsService) {
    this.SmsService = SmsService;
  }

  downloadLogs(batch) {
    this.isDownloading = true;

    this.trackClick(DOWNLOAD_HIT);
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
      this.batches = batches.filter(
        ({ status }) => status === this.batchStatuses.COMPLETED,
      );
    });
  }
}
