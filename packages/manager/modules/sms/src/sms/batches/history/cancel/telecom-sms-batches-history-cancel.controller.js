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
        this.goBack({
          reload: true,
        }).then(() =>
          this.displaySuccessMessage(
            this.$translate.instant('sms_cancel_success'),
          ),
        ),
      )
      .catch((error) =>
        this.goBack().then(() =>
          this.displayErrorMessage(
            this.$translate.instant('sms_cancel_error', {
              error: get(error, 'data.message', error.message),
            }),
          ),
        ),
      )
      .finally(() => {
        this.isCancellingBatch = false;
      });
  }
}
