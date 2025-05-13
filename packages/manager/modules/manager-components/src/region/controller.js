export default class ovhManagerRegionSelectorController {
  /* @ngInject */
  constructor(ovhManagerRegionService) {
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  $onInit() {
    this.formattedRegions = this.regions.map((region) =>
      this.ovhManagerRegionService.getRegion(region),
    );
  }
}
