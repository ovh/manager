import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  onSuccess() {
    this.goBack(
      this.$translate.instant(
        'autorenew_service_EMAIL_DOMAIN_terminate_success',
      ),
    );
  }

  onError(error) {
    this.goBack(
      this.$translate.instant(
        'autorenew_service_EMAIL_DOMAIN_terminate_error',
        { message: get(error, 'message') },
      ),
      'danger',
    );
  }
}
