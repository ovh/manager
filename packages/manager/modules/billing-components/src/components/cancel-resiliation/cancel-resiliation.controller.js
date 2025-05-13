import { get } from 'lodash-es';

export default class {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  confirmResiliationCancel() {
    this.loading = true;

    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::cancel-resiliation`,
        type: 'action',
      });
    }

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
