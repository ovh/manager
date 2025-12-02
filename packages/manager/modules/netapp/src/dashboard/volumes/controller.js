export default class {
  /* @ngInject */
  constructor(NetAppDashboardService) {
    this.replicationsSelectedVolumes =
      NetAppDashboardService.replicationsSelectedVolumes;
  }

  $onInit() {
    console.log('volumes', this);
  }
}
