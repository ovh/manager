export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  update(services) {
    return this.updateRenew(services)
      .then(() => this.goBack(
        this.$translate.instant('billing_autorenew_enable_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('billing_autorenew_enable_error', { message: _.get(error, 'data.message') }),
        'danger',
      ));
  }
}
