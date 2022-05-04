export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.loading = {
      init: true,
    };

    return this.DedicatedCloud.getManagementFee(
      this.productId,
      this.upgradeCode,
      1,
    )
      .then((data) => {
        this.upgradePlan = data;
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_upgrade_range_loading_error',
          )}: ${err.message || ''}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  onValidate() {
    this.trackClick(
      `datacenter::upgrade-private-cloud::confirm_${this.upgradeCode}`,
    );
    this.loading.init = true;

    return this.DedicatedCloud.orderManagementFee(
      this.productId,
      this.upgradeCode,
      1,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_datacenters_upgrade_range_order_success',
          ),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_upgrade_range_order_error',
          )}: ${err.message || ''}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  onCancel() {
    this.trackClick('datacenter::upgrade-private-cloud::cancel');
    return this.goBack();
  }
}
