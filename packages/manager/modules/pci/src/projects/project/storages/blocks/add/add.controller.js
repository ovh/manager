import angular from 'angular';
import get from 'lodash/get';
import map from 'lodash/map';

import BlockStorage from '../block.class';
import Region from '../region.class';

export default class PciBlockStorageAddController {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    CucCloudMessage,
    PciProjectStorageBlockService,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
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

    this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.$q.all({
        regions: this.PciProjectStorageBlockService.getAvailablesRegions(this.projectId),
        types: this.PciProjectStorageBlockService.getAvailablesTypes(),
      }))
      .then(({ regions, types }) => {
        this.regions = regions;
        this.types = types;

        this.typesList = map(
          this.types,
          (type) => ({
            id: type,
            name: this.$translate.instant(`pci_projects_project_storages_blocks_add_type_${type}_description`),
          }),
        );

        return this.PciProjectStorageBlockService.getPricesEstimations(
          this.projectId,
          this.regions,
          1,
        );
      })
      .then((typeRegionPrices) => {
        this.typeRegionPrices = typeRegionPrices;
      })
      .catch((err) => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_blocks_add_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ))
      .finally(() => {
        this.loadings.regions = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.blocks.add');
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

  onRegionsFocus() {
    this.displaySelectedRegion = false;
  }

  onRegionChange() {
    this.displaySelectedRegion = true;
  }

  onTypesFocus() {
    this.displaySelectedType = false;
  }

  onTypeChange() {
    this.displaySelectedType = true;

    this.storage.type = this.selectedType.id;

    this.loadings.size = true;
    return this.estimatePrice()
      .then(() => {
        this.size.max = this.storage.region.getMaxSize();
        this.storage.size = Math.min(Math.max(this.storage.size, this.size.min), this.size.max);
      })
      .finally(() => {
        this.loadings.size = false;
      });
  }

  onSizeChange() {
    // Wait the next digest because oui-numeric use the viewValue when calling on-change callback
    return this.$timeout(angular.noop, 0)
      .then(() => this.estimatePrice())
      // Force a digest...
      .then(() => this.$timeout(angular.noop, 0));
  }

  estimatePrice() {
    return this.PciProjectStorageBlockService
      .getVolumePriceEstimation(this.projectId, this.storage)
      .then((estimatedPrice) => {
        this.estimatedPrice = estimatedPrice;
      });
  }

  add() {
    this.loadings.save = true;

    return this.PciProjectStorageBlockService.add(this.projectId, this.storage)
      .then(() => this.goBack(
        this.$translate.instant(
          'pci_projects_project_storages_blocks_add_success_message',
          { volume: this.storage.name },
        ),
      ))
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
