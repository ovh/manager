export default class NetappCtrl {
  /* @ngInject */
  constructor($q, $translate, coreConfig, NetappService, CucRegionService) {
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.$translate = $translate;
    this.NetappService = NetappService;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.guideUrl = 'https://docs.ovh.com/fr/storage/';
  }
}
