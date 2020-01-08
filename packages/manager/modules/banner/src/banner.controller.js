export default class BannerController {
  /* @ngInject */
  constructor($translate, OvhManagerBannerService) {
    this.$translate = $translate;
    this.OvhManagerBannerService = OvhManagerBannerService;
  }

  $onInit() {
    this.OvhManagerBannerService.getBanner(this.$translate.use())
      .then((banner) => {
        this.banner = banner;
      })
      .catch(() => {
        this.banner = false;
      });
  }
}
