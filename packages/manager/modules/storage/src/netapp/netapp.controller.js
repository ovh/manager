export default class NetappCtrl {
  /* @ngInject */
  constructor(coreConfig, NetappService, CucRegionService, CORE_URLS, User) {
    this.coreConfig = coreConfig;
    this.NetappService = NetappService;
    this.CucRegionService = CucRegionService;
    this.CORE_URLS = CORE_URLS;
    this.User = User;
  }

  initGuides() {
    this.guidesLoading = true;
    return this.User.getUser()
      .then((user) => {
        this.guideUrl =
          this.CORE_URLS.guides.home[user.ovhSubsidiary] +
          this.CORE_URLS.guides.cda;
      })
      .catch((error) => {
        this.$log.error(error);
      })
      .finally(() => {
        this.guidesLoading = false;
      });
  }

  $onInit() {
    this.initGuides();
  }
}
