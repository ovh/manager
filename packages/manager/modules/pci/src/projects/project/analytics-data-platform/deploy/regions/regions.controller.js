export default class {
  /* @ngInject */
  constructor(CucRegionService) {
    this.cucRegionService = CucRegionService;
    this.data = {
      selectedRegion: null,
    };
  }

  dataChange() {
    this.onDataChange({ data: this.data });
  }
}
