export default class NetappDashboardCtrl {
  /* @ngInject */ constructor(constants, NetAppDashboardService) {
    this.GUIDE_LINKS = NetAppDashboardService.GUIDES_LINKS;
    this.constants = constants;
  }
}
