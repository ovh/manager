import get from 'lodash/get';

export default class SmsBatchCancelController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  executeCancelBatch() {
    this.isCancellingBatch = true;

    return this.cancelBatch(this.batch.id)
      .then(() =>
        this.onFinish(this.$translate.instant('sms_cancel_success'), true),
      )
      .catch((error) =>
        this.onFinish(
          this.$translate.instant('sms_cancel_error', {
            error: get(error, 'data.message', error.message),
          }),
          false,
        ),
      )
      .finally(() => {
        this.isCancellingBatch = false;
      });
  }
}
