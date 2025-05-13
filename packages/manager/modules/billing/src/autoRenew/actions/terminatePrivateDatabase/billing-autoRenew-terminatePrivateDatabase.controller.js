import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  onSuccess() {
    this.goBack(
      this.$translate.instant(
        'autorenew_privateDatabase_dashboard_close_service_success',
      ),
    );
  }

  onError(error) {
    this.goBack(
      this.$translate.instant(
        'autorenew_privateDatabase_dashboard_close_service_error',
        get(error, 'data.message'),
      ),
      'danger',
    );
  }
}
