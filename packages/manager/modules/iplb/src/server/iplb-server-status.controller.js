export default class IpblServerStatusController {
  /* @ngInject */
  constructor(IpblServerStatusService) {
    this.IpblServerStatusService = IpblServerStatusService;
  }

  $onInit() {
    if (!this.server) {
      this.server = {};
    }

    this.iconType = this.IpblServerStatusService.getStatusIcon(this.server);
  }
}
