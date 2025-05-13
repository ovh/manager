import assign from 'lodash/assign';
import pick from 'lodash/pick';

export default class {
  /* @ngInject */
  constructor($q, $translate, DedicatedCloud) {
    this.$q = $q;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.loaders = {
      loading: true,
    };
  }

  loadDisablingPrices() {
    this.loaders.loading = true;
    return this.$q
      .all({
        pcc: this.DedicatedCloud.getSelected(this.productId),
        commercialRanges: this.DedicatedCloud.isOptionToggable(
          this.productId,
          this.option,
          'enabled',
          false,
        ),
      })
      .then((data) =>
        this.DedicatedCloud.fetchAllHostsPrices(
          this.productId,
          data.commercialRanges.oldCommercialVersion,
          data.commercialRanges.newCommercialVersion,
          data.pcc.location,
        ),
      )
      .then((data) => {
        this.disablingPrices = data.current.map((host, index) =>
          assign(pick(host, ['datacenter', 'name', 'billingType']), {
            current: host.price,
            next: data.next[index].price,
          }),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_vmware_orderopt_load_prices_error',
          )} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.loaders.loading = false;
      });
  }

  disable() {
    this.loaders.loading = true;
    this.DedicatedCloud.disableOption(this.productId, this.option)
      .then(() => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_vmware_cancelopt_unactivate_succes',
          ),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_vmware_cancelopt_unactivate_error',
          )} ${err.message || err}`,
          'danger',
        );
      });
  }
}
