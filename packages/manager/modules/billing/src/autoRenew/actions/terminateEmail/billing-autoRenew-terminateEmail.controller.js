import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  onSuccess() {
    this.goToAutorenew(
      this.$translate.instant(
        'autorenew_service_EMAIL_DOMAIN_terminate_success',
      ),
      'success',
      true,
    );
  }

  onError(error) {
    this.goToAutorenew(
      this.$translate.instant(
        'autorenew_service_EMAIL_DOMAIN_terminate_error',
        { message: get(error, 'message') },
      ),
      'danger',
    );
  }
}
