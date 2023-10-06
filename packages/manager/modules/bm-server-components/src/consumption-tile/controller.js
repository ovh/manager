export default class QuotaTileController {
  canOrderMoreTraffic() {
    return (
      !this.server.isExpired &&
      this.server.canOrderQuota &&
      this.trafficOrderables?.data.length
    );
  }
}
