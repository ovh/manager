import get from 'lodash/get';

export default class SmsBatchesPendingController {
  /* @ngInject */
  constructor($q, $translate) {
    this.$q = $q;
    this.$translate = $translate;
  }

  cancelBatches(selectedBatches) {
    this.isCanceling = true;

    return this.$q
      .all(selectedBatches.map(({ id }) => this.cancelBatch(id)))
      .then(() => this.reloadPage())
      .then(() =>
        this.displaySuccessMessage(
          this.$translate.instant('sms_batches_pending_cancel_success'),
        ),
      )
      .catch((error) => {
        this.error = get(error, 'data.message', error.message);
      })
      .finally(() => {
        this.isCanceling = false;
      });
  }
}
