import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.descriptions = {
      getSingleUpdate: (service) =>
        this.$translate.instant('billing_autorenew_disable_bulk_single', {
          serviceName: service.getServiceName(),
        }),
      getCompleteUpdate: () =>
        this.$translate.instant('billing_autorenew_disable_bulk'),
      getUncompleteUpdate: (count) =>
        count === 1
          ? this.$translate.instant(
              'billing_autorenew_disable_bulk_unavailable_one',
            )
          : this.$translate.instant(
              'billing_autorenew_disable_bulk_unavailable',
              { count },
            ),
    };
  }

  update(services) {
    return this.updateRenew(services)
      .then(() =>
        this.goBack(
          this.$translate.instant('billing_autorenew_disable_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('billing_autorenew_disable_error', {
            message: get(error, 'data.message'),
          }),
          'danger',
        ),
      );
  }
}
