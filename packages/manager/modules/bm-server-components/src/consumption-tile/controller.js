export default class QuotaTileController {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  canOrderMoreTraffic() {
    return (
      !this.server.isExpired &&
      this.server.canOrderQuota &&
      this.trafficOrderables?.data.length
    );
  }

  getTabItemUrl(tabItemName) {
    return this.$state.href(`app.dedicated-server.server.${tabItemName}`);
  }
}
