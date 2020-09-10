export default class {
  /* @ngInject */
  constructor(DedicatedCloud, $translate) {
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;
  }

  $onInit() {
    this.orderDatastores = {
      datacenter: null,
      model: null,
      selected: null,
      selectedModel: null,
      quantityToOrder: 1,
      orderResult: null,
      agreeContract: null,
      loading: false,
    };
    this.dedicatedCloud = null;
  }

  loadDatastoresProfiles() {
    this.orderDatastores.loading = true;
    this.orderDatastores.datacenter = this.datacenterModel;

    this.DedicatedCloud.getSelected(this.productId, false).then(
      (dedicatedCloud) => {
        this.dedicatedCloud = dedicatedCloud;
        this.DedicatedCloud.getOrderableDatastoresProfiles(
          this.productId,
          this.dedicatedCloud.location,
          this.orderDatastores.datacenter.id,
        )
          .then((data) => {
            this.orderDatastores.model = data;
            this.orderDatastores.loading = false;
          })
          .catch((data) => {
            this.goBack(
              `${this.$translate.instant(
                'dedicatedCloud_configuration_order_datastores_finish_fail',
                {
                  t0: this.orderDatastores.datacenter.name,
                },
              )} ${data.message || data}`,
              'danger',
            );
            this.orderDatastores.loading = false;
          });
      },
      (data) => {
        this.orderDatastores.loading = false;
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_order_datastores_finish_fail',
            {
              t0: this.orderDatastores.datacenter.name,
            },
          )} ${data.message || data}`,
          'danger',
        );
      },
    );
  }

  getDatastoreSelected() {
    this.orderDatastores.loading = true;
    this.orderDatastores.selectedModel = this.orderDatastores.model[
      this.orderDatastores.selected
    ];
    this.DedicatedCloud.getMonthlyDatastoreOrder(
      this.productId,
      this.orderDatastores.datacenter.id,
      this.orderDatastores.selectedModel.name,
      this.orderDatastores.quantityToOrder,
    )
      .then((data) => {
        this.orderDatastores.orderResult = data;
        this.orderDatastores.loading = false;
      })
      .catch((data) => {
        this.orderDatastores.loading = false;
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_order_datastores_finish_fail',
            {
              t0: this.orderDatastores.datacenter.name,
            },
          )} ${data.message || data}`,
          'danger',
        );
      });
  }

  displayBC() {
    this.orderDatastores.loading = true;
    this.DedicatedCloud.orderDatastores(
      this.productId,
      this.orderDatastores.datacenter.id,
      this.orderDatastores.selectedModel.name,
      this.orderDatastores.quantityToOrder,
    )
      .then((data) => {
        window.open(data.url, '_blank');
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_order_datastores_finish_success',
            {
              t0: data.url,
              t1: data.orderId,
            },
          )}`,
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_order_datastores_finish_fail',
            {
              t0: this.orderDatastores.datacenter.name,
            },
          )} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.orderDatastores.loading = false;
      });
  }
}
