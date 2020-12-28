export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.orderHosts = {
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

  loadHostsProfiles() {
    this.orderHosts.loading = true;
    this.orderHosts.datacenter = this.datacenterModel;

    this.DedicatedCloud.getSelected(this.productId, false)
      .then(
        (dedicatedCloud) => {
          this.dedicatedCloud = dedicatedCloud;
          return this.DedicatedCloud.getOrderableHostsProfiles(
            this.productId,
            this.dedicatedCloud.location,
            this.orderHosts.datacenter.id,
          )
            .then((data) => {
              this.orderHosts.model = data;
            })
            .catch((data) => {
              this.goBack(
                `${this.$translate.instant(
                  'dedicatedCloud_configuration_order_hosts_finish_fail',
                  {
                    t0: this.orderHosts.datacenter.name,
                  },
                )} ${data.message || data}`,
                'danger',
              );
            });
        },
        (data) => {
          this.goBack(
            `${this.$translate.instant(
              'dedicatedCloud_configuration_order_hosts_finish_fail',
              {
                t0: this.orderHosts.datacenter.name,
              },
            )} ${data.message || data}`,
            'danger',
          );
        },
      )
      .finally(() => {
        this.orderHosts.loading = false;
      });
  }

  getHostSelected() {
    this.orderHosts.loading = true;
    this.orderHosts.selectedModel = this.orderHosts.model[
      this.orderHosts.selected
    ];

    this.DedicatedCloud.getMonthlyHostOrder(
      this.productId,
      this.orderHosts.datacenter.id,
      this.orderHosts.selectedModel.name,
      this.orderHosts.quantityToOrder,
    )
      .then((data) => {
        this.orderHosts.orderResult = data;
      })
      .catch((data) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_order_hosts_finish_fail',
            {
              t0: this.orderHosts.datacenter.name,
            },
          )} ${data.message || data}`,
          'danger',
        );
      })
      .finally(() => {
        this.orderHosts.loading = false;
      });
  }

  displayBC() {
    this.orderHosts.loading = true;

    this.DedicatedCloud.orderHosts(
      this.productId,
      this.orderHosts.datacenter.id,
      this.orderHosts.selectedModel.name,
      this.orderHosts.quantityToOrder,
    )
      .then((data) => {
        window.open(data.url, '_blank');
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_configuration_order_hosts_finish_success',
            {
              t0: data.url,
              t1: data.orderId,
            },
          ),
        );
      })
      .catch((data) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_configuration_order_hosts_finish_fail',
            {
              t0: this.orderHosts.datacenter.name,
            },
          )} ${data.message || data}`,
          'danger',
        );
      });
  }
}
