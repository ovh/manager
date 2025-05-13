export default class NutanixDashboarInstallNodeModal {
  /* @ngInject */
  constructor(ovhManagerPccDatacenterService, DedicatedCloud, $translate, $q) {
    this.DedicatedCloud = DedicatedCloud;
    this.$translate = $translate;
    this.$q = $q;
    this.ovhManagerPccDatacenterService = ovhManagerPccDatacenterService;
  }

  $onInit() {
    this.isLoading = true;
    this.nsxtEdgeId =
      Number.parseInt(this.nsxtEdgePreSelected, 10) || undefined;

    this.$q
      .all([this.loadNsxtEdgeNetworks(), this.loadDatastores()])
      .then(() => {
        this.isLoading = false;
      });
  }

  loadNsxtEdgeNetworks() {
    return this.ovhManagerPccDatacenterService
      .getNsxtEdgeByDatacenter(this.serviceName, this.datacenterId, {
        limit: 20,
        offset: 0,
      })
      .then(({ data }) => {
        this.nsxtEdgesItems = data;
      });
  }

  loadDatastores() {
    return this.DedicatedCloud.getDatastores(
      this.productId,
      this.datacenterId,
      100,
      0,
    ).then((response) => {
      this.datastoreItems = response.list.results;
    });
  }

  onSubmit() {
    if (this.moveNsxtEdgeForm.$invalid) {
      return;
    }

    this.isLoading = true;

    this.moveNsxtEdge({
      nsxtEdgeId: this.nsxtEdgeId,
      datacenterId: this.datacenterId,
      datastore: this.datastoreId,
    })
      .then(() => {
        this.handleSuccess(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_edge_relocate_success_banner',
          )}`,
        );
      })
      .catch((error) => {
        this.handleError(
          this.$translate.instant(
            'dedicatedCloud_datacenter_edge_relocate_error_banner',
            { error: error.data?.message },
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
