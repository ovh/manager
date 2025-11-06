import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  onSuccess() {
    this.goToAutorenew(
      this.$translate.instant(
        'autorenew_enterprise_cloud_database_close_service_success',
      ),
      'success',
      true,
    );
  }

  onError(error) {
    this.goToAutorenew(
      this.$translate.instant(
        'autorenew_enterprise_cloud_database_close_service_error',
        get(error, 'data.message'),
      ),
      'danger',
    );
  }
}
