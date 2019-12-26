(() => {
  class CloudProjectComputeInfrastructureCtrl {
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

      if (this.$state.is('iaas.pci-project.compute.infrastructure')) {
        this.InfrastructureService.getPreferredView().then((view) => {
          this.$state.go(`iaas.pci-project.compute.infrastructure.${view}`);
        });
      }
    }
  }

  angular
    .module('managerApp')
    .controller(
      'CloudProjectComputeInfrastructureCtrl',
      CloudProjectComputeInfrastructureCtrl,
    );
})();
