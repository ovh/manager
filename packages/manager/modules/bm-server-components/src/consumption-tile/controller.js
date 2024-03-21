export default class QuotaTileController {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  $onInit() {
    this.statePrefix = this.statePrefix || 'app.dedicated-server.server';
  }

  canOrderMoreTraffic() {
    return (
      !this.server.isExpired &&
      this.server.canOrderQuota &&
      this.trafficOrderables?.data.length
    );
  }

  getTabItemUrl(tabItemName) {
    return this.$state.href(`${this.statePrefix}.${tabItemName}`);
  }
}
