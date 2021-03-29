import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';

export default class RegionsCtrl {
  /* @ngInject */
  constructor($state, $translate, CucCloudMessage, OvhApiCloudProjectRegion) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
  }

  $onInit() {
    this.allRegionsAdded = false;
    this.regionToAdd = null;
    this.isLoading = false;

    this.groupRegionsByDatacenter();
    this.groupRegionsByContinent();
    this.groupAvailableRegionsByDatacenter();
    this.groupAvailableRegionsByContinent();

    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.regions');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.regions',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  static groupByDatacenter(regions) {
    return groupBy(regions, 'macroRegion.text');
  }

  groupRegionsByDatacenter() {
    this.regionsByDatacenter = RegionsCtrl.groupByDatacenter(this.regions);
  }

  groupRegionsByContinent() {
    this.regionsByContinent = reduce(
      groupBy(this.regions, 'continent'),
      (regionsByContinent, regions, continent) => ({
        ...regionsByContinent,
        [continent]: RegionsCtrl.groupByDatacenter(regions),
      }),
      {},
    );
  }

  groupAvailableRegionsByDatacenter() {
    this.availableRegionsByDatacenter = RegionsCtrl.groupByDatacenter(
      this.availableRegions,
    );
    this.allRegionsAdded = isEmpty(this.availableRegionsByDatacenter);
  }

  groupAvailableRegionsByContinent() {
    this.availableRegionsByContinent = reduce(
      groupBy(this.availableRegions, 'continent'),
      (regionsByContinent, regions, continent) => ({
        ...regionsByContinent,
        [continent]: RegionsCtrl.groupByDatacenter(regions),
      }),
      {},
    );
  }

  addRegions() {
    this.isLoading = true;

    return this.OvhApiCloudProjectRegion.v6()
      .addRegion(
        { serviceName: this.projectId },
        { region: this.regionToAdd.microRegion.code },
      )
      .$promise.then(() =>
        this.OvhApiCloudProjectRegion.AvailableRegions().v6().resetQueryCache(),
      )
      .then(() => this.$state.reload())
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_regions_add_region_success',
            {
              code: this.regionToAdd.microRegion.code,
            },
          ),
        );
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_regions_add_region_error',
            { message: get(error, 'data.message') },
          ),
        );
      });
  }
}
