import { VCD_PLAN_CODE } from '../../dedicatedCloud.constant';

export default class VdcOrderController {
  /* @ngInject */
  constructor(
    $q,
    $window,
    $translate,
    DedicatedCloud,
    dedicatedCloudDataCenterHostService,
    RedirectionService,
  ) {
    this.$q = $q;
    this.$window = $window;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.dedicatedCloudDataCenterHostService = dedicatedCloudDataCenterHostService;
    this.expressOrderURL = RedirectionService.getURL('expressOrder');
  }

  $onInit() {
    this.hosts = [];
    this.guideLinks = this.DedicatedCloud.getVCDGuideLinks();
    return this.loadData();
  }

  loadHosts() {
    return this.$q
      .all(
        this.datacenters.map(({ datacenterId }) =>
          this.dedicatedCloudDataCenterHostService.getPaginatedHosts(
            this.productId,
            datacenterId,
            { pageSize: 100, offset: 0 },
          ),
        ),
      )
      .then((results) => results.map(({ data }) => data).flat());
  }

  loadData() {
    this.loading = true;

    return this.$q
      .all({
        hosts: this.loadHosts(),
        pricingMode: this.DedicatedCloud.getVCDPricingMode(this.productId),
      })
      .then(({ hosts, pricingMode }) => {
        this.pricingMode = pricingMode;
        this.hosts = hosts;
      })
      .catch(() => {
        this.close(
          this.$translate.instant(
            'dedicatedCloud_vmware_cloud_director_order_error',
          ),
          'error',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  order() {
    if (this.ordered) {
      this.close();
    } else {
      this.generateExpressOrder();
    }
  }

  close(message = false, type = 'success') {
    this.goBack(message, type, this.ordered);
  }

  generateExpressOrder() {
    this.ordered = true;
    this.orderLink = `${this.expressOrderURL}?products=${JSURL.stringify([
      {
        productId: 'privateCloud',
        serviceName: this.productId,
        planCode: VCD_PLAN_CODE,
        duration: 'P1M',
        pricingMode: this.pricingMode,
        quantity: 1,
      },
    ])}`;
    this.$window.open(this.orderLink, '_blank', 'noopener');
  }
}
