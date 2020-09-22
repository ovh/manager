import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  delete() {
    this.isDeleting = true;

    return this.deleteOutgoing(this.outgoing.id)
      .then(() =>
        this.goBackToDetails({ reload: true }).then(() => {
          this.displaySuccessMessage(
            this.$translate.instant(
              'sms_batches_statistics_details_delete_success',
            ),
          );
        }),
      )
      .catch((error) =>
        this.goBackToDetails().then(() => {
          this.displayErrorMessage(
            this.$translate.instant(
              'sms_batches_statistics_details_delete_error',
              {
                error: get(error, 'data.message', error.message),
              },
            ),
          );
        }),
      )
      .finally(() => {
        this.isDeleting = false;
      });
  }
}
