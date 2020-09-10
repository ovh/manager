export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.loading = false;
  }

  deleteDatacenter() {
    this.loading = true;
    this.DedicatedCloud.deleteDatacenter(this.productId, this.datacenterId)
      .then(() => {
        this.goBack(
          this.$translate.instant('dedicatedCloud_datacenter_delete_success', {
            t0: this.datacenterId,
          }),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('dedicatedCloud_datacenter_delete_error', {
            t0: this.datacenterId,
          })} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
