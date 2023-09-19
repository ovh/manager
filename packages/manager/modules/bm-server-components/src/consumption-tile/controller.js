export default class QuotaTileController {
  /* @ngInject */

  canOrderTraffic() {
    return !this.server.isExpired && this.server.canOrderQuota;
  }

  canOrderMoreTraffic() {
    return (
      !this.server.isExpired &&
      this.server.canOrderQuota &&
      this.trafficOrderables?.data.length
    );
  }
}
