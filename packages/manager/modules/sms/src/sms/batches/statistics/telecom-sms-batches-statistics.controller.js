import get from 'lodash/get';

export default class SmsBatchesStatisticsController {
  $onInit() {
    this.selectedBatch = this.batch || this.batches[0];

    return this.onBatchSelect(this.selectedBatch);
  }

  onBatchSelect(batch) {
    this.isLoadingStats = true;
    this.batch = batch;

    return this.getBatchStatistics(this.batch.id)
      .then((statistics) => {
        Object.assign(this.batch, {
          delivered: statistics.delivered,
          deliveredPercentage: `(${Math.round(
            (statistics.delivered / (statistics.sent || 1)) * 100 * 100,
          ) / 100}%)`,
          sent: statistics.sent,
          stoplisted: statistics.stoplisted,
          stoplistedPercentage: `(${Math.round(
            (statistics.stoplisted / (statistics.sent || 1)) * 100 * 100,
          ) / 100}%)`,
        });
      })
      .catch((error) => {
        this.error = get(error, 'data.message', error.message);
      })
      .finally(() => {
        this.isLoadingStats = false;
      });
  }

  static isInError(status, statusList) {
    return status === statusList.ERROR;
  }

  static isInSuccess(status, statusList) {
    return status === statusList.COMPLETED;
  }

  static isInInfo(status, statusList) {
    return [
      statusList.PENDING,
      statusList.INSERTING,
      statusList.INSERTED,
    ].includes(status);
  }

  static isInWarning(status, statusList) {
    return [
      statusList.TO_CANCEL,
      statusList.CANCELING,
      statusList.CANCELED,
    ].includes(status);
  }
}
