import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

class RegionsCtrl {
  constructor(
    $stateParams,
    CucCloudMessage,
    CucServiceHelper,
    CucControllerHelper,
    OvhApiCloudProjectRegion,
    CloudProjectVirtualMachineAddService,
    CucRegionService,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
    this.CucRegionService = CucRegionService;
    this.CucServiceHelper = CucServiceHelper;
    this.VirtualMachineAddService = CloudProjectVirtualMachineAddService;
    this.serviceName = $stateParams.projectId;
  }

  $onInit() {
    this.availableRegionToAdd = null;
    this.initLoaders();
  }

  initLoaders() {
    // load regions
    this.initRegions();
    this.initRegionsByDatacenter();
    this.initRegionsByContinent();
    // load available regions
    this.initAvailableRegions();
    this.initAvailableRegionsByDatacenter();
    this.initAvailableRegionsByContinent();
  }

  initRegions() {
    this.regions = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.OvhApiCloudProjectRegion.v6()
          .query({ serviceName: this.serviceName })
          .$promise.then((regionIds) =>
            map(regionIds, (region) => this.CucRegionService.getRegion(region)),
          )
          .catch((error) =>
            this.CucServiceHelper.errorHandler(
              'cpci_add_regions_get_regions_error',
            )(error),
          ),
    });
    return this.regions.load();
  }

  initRegionsByDatacenter() {
    this.regionsByDatacenter = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.regions.promise.then((regions) =>
          this.VirtualMachineAddService.constructor.groupRegionsByDatacenter(
            regions,
          ),
        ),
    });
    return this.regionsByDatacenter.load();
  }

  initRegionsByContinent() {
    this.regionsByContinent = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.regionsByDatacenter.promise.then((regions) =>
          groupBy(regions, 'continent'),
        ),
    });
    return this.regionsByContinent.load();
  }

  initAvailableRegions() {
    this.availableRegions = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.OvhApiCloudProjectRegion.AvailableRegions()
          .v6()
          .query({ serviceName: this.serviceName })
          .$promise.then((regionIds) =>
            map(regionIds, (region) =>
              this.CucRegionService.getRegion(region.name),
            ),
          )
          .catch((error) =>
            this.CucServiceHelper.errorHandler(
              'cpci_add_regions_get_available_regions_error',
            )(error),
          ),
    });
    return this.availableRegions.load();
  }

  initAvailableRegionsByDatacenter() {
    this.availableRegionsByDatacenter = this.CucControllerHelper.request.getHashLoader(
      {
        loaderFunction: () =>
          this.availableRegions.promise.then((regions) =>
            this.VirtualMachineAddService.constructor.groupRegionsByDatacenter(
              regions,
            ),
          ),
      },
    );
    return this.availableRegionsByDatacenter.load();
  }

  initAvailableRegionsByContinent() {
    this.availableRegionsByContinent = this.CucControllerHelper.request.getHashLoader(
      {
        loaderFunction: () =>
          this.availableRegionsByDatacenter.promise.then((regions) =>
            groupBy(regions, 'continent'),
          ),
      },
    );
    return this.availableRegionsByContinent.load();
  }

  addRegions() {
    this.CucCloudMessage.flushChildMessage();
    this.addRegion = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.OvhApiCloudProjectRegion.v6()
          .addRegion(
            { serviceName: this.serviceName },
            { region: this.availableRegionToAdd.microRegion.code },
          )
          .$promise.then(() =>
            this.OvhApiCloudProjectRegion.AvailableRegions()
              .v6()
              .resetQueryCache(),
          )
          .then(() => this.initLoaders())
          .then(() =>
            this.CucServiceHelper.successHandler(
              'cpci_add_regions_add_region_success',
            )({
              code: this.availableRegionToAdd.microRegion.code,
            }),
          )
          .catch((error) =>
            this.CucServiceHelper.errorHandler(
              'cpci_add_regions_add_region_error',
            )(error),
          )
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    this.addRegion.load();
  }
}

angular.module('managerApp').controller('RegionsCtrl', RegionsCtrl);
