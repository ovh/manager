import get from 'lodash/get';

export default class SmsBatchesPendingController {
  /* @ngInject */
  constructor($q) {
    this.$q = $q;
  }

  cancelBatches(selectedBatches) {
    this.isCanceling = true;

    return this.$q
      .all(selectedBatches.map(({ id }) => this.cancelBatch(id)))
      .then(() => this.reloadPage())
      .catch((error) => {
        this.error = get(error, 'data.message', error.message);
      })
      .finally(() => {
        this.isCanceling = false;
      });
  }
}
