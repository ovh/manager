export default class CloudProjectComputeInfrastructureCtrl {
  /* @ngInject */
  constructor(
    $state,
    CLOUD_MONITORING,
    CloudProjectComputeInfrastructureService,
  ) {
    this.$state = $state;
    this.CLOUD_MONITORING = CLOUD_MONITORING;
    this.InfrastructureService = CloudProjectComputeInfrastructureService;
  }

  $onInit() {
    this.vmMonitoringUpgradeThreshold = this.CLOUD_MONITORING.vm.upgradeAlertThreshold;

    if (this.$state.is('pci.projects.project.legacy.compute.infrastructure')) {
      this.InfrastructureService.getPreferredView()
        .then((view) => {
          this.$state.go(`pci.projects.project.legacy.compute.infrastructure.${view}`);
        });
    }
  }
}
