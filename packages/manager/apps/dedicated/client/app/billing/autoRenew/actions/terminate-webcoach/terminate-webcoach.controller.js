export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  onSuccess() {
    this.goBack(
      this.$translate.instant('autorenew_webcoach_close_service_success'),
    );
  }

  onError(error) {
    this.goBack(
      this.$translate.instant('autorenew_webcoach_close_service_error', _.get(error, 'data.message')),
      'danger',
    );
  }
}
