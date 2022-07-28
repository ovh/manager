import angular from 'angular';
import get from 'lodash/get';

import BlockStorage from '../block.class';
import Region from '../region.class';

const VOLUMES_PLAN_CODE = {
  STANDARD: 'volume.classic.consumption',
  HIGH_SPEED: 'volume.high-speed.consumption',
  HIGH_SPEED_GEN_2: 'volume.high-speed-gen2.consumption',
};

export default class PciBlockStorageAddController {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    CucCloudMessage,
    CucCurrencyService,
    PciProjectStorageBlockService,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCurrencyService = CucCurrencyService;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.typeRegionPrices = null;
    this.displaySelectedRegion = false;
    this.displaySelectedType = false;

    this.loadings = {
      regions: false,
      types: false,
      size: false,
      save: false,
    };

    this.size = {
      min: Region.getMinSize(),
      max: 0,
    };

    this.storage = new BlockStorage();

    this.loadings.regions = true;

    this.$translate
      .refresh()
      .then(() => this.loadMessages())
      .then(() =>
        this.$q.all({
          regions: this.PciProjectStorageBlockService.getAvailablesRegions(
            this.projectId,
          ),
          consumptionVolumeAddons: this.PciProjectStorageBlockService.getConsumptionVolumesAddons(
            this.catalog,
          ),
        }),
      )
      .then(({ regions, consumptionVolumeAddons }) => {
        this.regions = regions;
        this.consumptionVolumeAddons = consumptionVolumeAddons;
        this.types = consumptionVolumeAddons.map(
          (addon) => addon.blobs.technical.name,
        );

        const volumeSize = 1;
        return this.PciProjectStorageBlockService.constructor.getPricesEstimations(
          this.catalog,
          this.regions,
          volumeSize,
          this.types,
        );
      })
      .then((typeRegionPrices) => {
        this.typeRegionPrices = typeRegionPrices;
      })
      .catch((err) =>
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_add_error_query',
            { message: get(err, 'data.message', '') },
          ),
        ),
      )
      .finally(() => {
        this.loadings.regions = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.storages.blocks.add',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.blocks.add',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  isAvailableVolumeType(volumeAddon) {
    const { region } = this.storage;
    const volumePlan = this.volumesAvailability.plans.find(
      (plan) => plan.code === volumeAddon.planCode,
    );

    return (
      region && volumePlan?.regions.some(({ name }) => name === region.name)
    );
  }

  formatVolumePrice(price) {
    const convertPrice = this.CucCurrencyService.convertUcentsToCurrency(price);
    const priceCurrency = this.CucCurrencyService.getCurrentCurrency();

    return `${convertPrice}${priceCurrency}`;
  }

  static getAddonVolumeIopsInfo(volumeAddon) {
    const { iops } = volumeAddon.blobs.technical.volume;

    return iops.max || iops.level;
  }

  computeBandwidthToAllocate() {
    const { bandwidth } = this.selectedVolumeAddon.blobs.technical;
    const allocatedBandwidth = this.storage.size * bandwidth.level;
    const maxBandwidthInMb = bandwidth.max * 1000;

    return allocatedBandwidth <= maxBandwidthInMb
      ? `${allocatedBandwidth} ${bandwidth.unit}`
      : `${maxBandwidthInMb} ${bandwidth.unit}`;
  }

  computeIopsToAllocate() {
    const { volume } = this.selectedVolumeAddon.blobs.technical;
    const allocatedIops = this.storage.size * volume.iops.level;

    return allocatedIops <= volume.iops.max
      ? `${allocatedIops} ${volume.iops.unit}`
      : `${volume.iops.max} ${volume.iops.unit}`;
  }

  isHighSpeedGen2Volume() {
    return (
      this.selectedVolumeAddon?.planCode === VOLUMES_PLAN_CODE.HIGH_SPEED_GEN_2
    );
  }

  onRegionsFocus() {
    this.displaySelectedRegion = false;
  }

  onRegionChange() {
    this.displaySelectedRegion = true;
    this.selectedVolumeAddon = null;
  }

  onTypesFocus() {
    this.displaySelectedType = false;
  }

  onTypeChange() {
    this.displaySelectedType = true;

    this.storage.type = this.selectedVolumeAddon.blobs.technical.name;

    this.loadings.size = true;
    return this.estimatePrice()
      .then(() => {
        this.size.max = this.storage.region.getMaxSize();
        this.storage.size = Math.min(
          Math.max(this.storage.size, this.size.min),
          this.size.max,
        );
      })
      .finally(() => {
        this.loadings.size = false;
      });
  }

  onSizeChange() {
    // Wait the next digest because oui-numeric use the viewValue when calling on-change callback
    return (
      this.$timeout(angular.noop, 0)
        .then(() => this.estimatePrice())
        // Force a digest...
        .then(() => this.$timeout(angular.noop, 0))
    );
  }

  estimatePrice() {
    return this.PciProjectStorageBlockService.getVolumePriceEstimation(
      this.projectId,
      this.storage,
      this.catalogEndpoint,
    ).then((estimatedPrice) => {
      this.estimatedPrice = estimatedPrice;
    });
  }

  add() {
    this.loadings.save = true;

    return this.PciProjectStorageBlockService.add(this.projectId, this.storage)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_add_success_message',
            { volume: this.storage.name },
          ),
        ),
      )
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_blocks_add_error_post',
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.storages.blocks.add',
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
