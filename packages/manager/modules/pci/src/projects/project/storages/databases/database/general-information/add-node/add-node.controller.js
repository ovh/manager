import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.showMonthlyPrices = false;
    this.addingNode = false;
    this.name = this.database.description;
    this.trackDashboard('general_information::add_node');
    // compute current flavor & engine
    this.currentFlavor = this.getCurrentFlavor();
    this.dbEngine = this.engines.find(
      (engine) => engine.name === this.database.engine,
    );
    // compute price
    this.computePrice();
  }

  computePrice() {
    const flavorPrice = this.showMonthlyPrices
      ? this.currentFlavor.nodeMonthlyPrice
      : this.currentFlavor.nodeHourlyPrice;
    let addedStorageByNode =
      this.database.storage.size.value - this.currentFlavor.minDiskSize;
    // if engine is distributed, the stockage is distributed between the nodes, so to get the
    // size of for one node, we need to divide by the number of nodes
    if (this.dbEngine.isDistributedStorage) {
      addedStorageByNode /= this.database.nodeNumber;
    }
    const additionalStoragePrice = Math.max(
      0,
      this.showMonthlyPrices
        ? addedStorageByNode * this.currentFlavor.hourlyPricePerGB.priceInUcents
        : addedStorageByNode *
            this.currentFlavor.monthlyPricePerGB.priceInUcents,
    );

    this.price = flavorPrice.priceInUcents + additionalStoragePrice;
  }

  addNode() {
    this.trackDashboard('general_information::add_node_validate');
    this.addingNode = true;
    return this.DatabaseService.addNode(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.database.flavor,
      this.database.region,
    )
      .then((nodeInfo) =>
        this.onNodeAdd(
          nodeInfo,
          this.$translate.instant(
            'pci_databases_general_information_add_node_success',
          ),
          'info',
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_general_information_add_node_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  cancel() {
    this.trackDashboard('general_information::add_node_cancel');
    this.goBack();
  }
}
