import { get } from 'lodash-es';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  confirmResiliationCancel() {
    this.trackClick();
    this.loading = true;

    return this.cancelResiliation(this.service)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'autorenew_service_cancel_resiliation_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'autorenew_service_cancel_resiliation_error',
            { message: get(error, 'data.message') },
          ),
          'danger',
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }
}
