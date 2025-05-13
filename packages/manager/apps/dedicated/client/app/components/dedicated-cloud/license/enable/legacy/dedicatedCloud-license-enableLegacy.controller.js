export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.spla = {
      agreeContract: false,
      model: null,
      loading: false,
    };
    this.loadActiveSpla();
  }

  loadActiveSpla() {
    this.spla.loading = true;
    this.DedicatedCloud.getSplaOrder(this.productId)
      .then(
        (order) => {
          this.spla.model = order;
        },
        (data) => {
          this.goBack(
            `${this.$translate.instant(
              'dedicatedCloud_tab_licences_active_spla_load_fail',
            )}: ${data.message || data}`,
            'danger',
          );
        },
      )
      .finally(() => {
        this.spla.loading = false;
      });
  }

  enableSpla() {
    this.spla.loading = true;
    this.DedicatedCloud.postSplaOrder(this.productId)
      .then(
        (data) => {
          this.goBack(
            `${this.$translate.instant(
              'dedicatedCloud_tab_licences_active_spla_success',
              {
                t0: data.url,
                t1: data.orderId,
              },
            )}`,
          );
          window.open(data.url, '_blank');
        },
        (data) => {
          this.goBack(
            `${this.$translate.instant(
              'dedicatedCloud_tab_licences_active_spla_fail',
            )}: ${data.message || data}`,
            'danger',
          );
        },
      )
      .finally(() => {
        this.spla.loading = false;
      });
  }
}
