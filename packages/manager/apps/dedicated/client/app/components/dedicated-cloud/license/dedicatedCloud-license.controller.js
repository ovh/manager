export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.licences = {
      model: null,
      spla: null,
      canActive: false,
    };
    this.loading = {
      licences: false,
      error: false,
    };
    this.loadLicences();
  }

  loadLicences() {
    this.loading.licences = true;
    this.DedicatedCloud.getDatacenterLicence(
      this.productId,
      this.usesLegacyOrder,
    )
      .then(
        (datacenter) => {
          this.licences.spla = datacenter.isSplaActive;
          this.licences.canActive = datacenter.canOrderSpla;
        },
        (data) => {
          this.setMessage(
            `${this.$translate.instant(
              'dedicatedCloud_dashboard_loading_error',
            )}: ${data.message || data}`,
            'danger',
          );
          this.loading.error = true;
        },
      )
      .finally(() => {
        this.loading.licences = false;
      });
  }

  canBeActivatedSpla() {
    return this.licences.spla === false && this.licences.canActive;
  }
}
