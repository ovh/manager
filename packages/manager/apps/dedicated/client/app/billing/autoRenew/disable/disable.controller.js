import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  update(services) {
    return this.updateRenew(services)
      .then(() => this.goBack(
        this.$translate.instant('billing_autorenew_disable_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('billing_autorenew_disable_error', { message: get(error, 'data.message') }),
        'danger',
      ));
  }
}
