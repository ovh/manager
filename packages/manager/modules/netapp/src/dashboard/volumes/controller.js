export default class {
  /* @ngInject */
  constructor(NetAppDashboardService) {
    this.NetAppDashboardService = NetAppDashboardService;
    this.selectedReplicationsCheckboxes = {};
    this.AWAITING_REPLICATION_STATUS = 'awaiting_replication';
  }

  $onDestroy() {
    this.NetAppDashboardService.replicationsSelectedVolumes = [];
  }

  handleCheckboxChange({ volumeId, checked }) {
    if (!checked)
      this.NetAppDashboardService.replicationsSelectedVolumes = this.NetAppDashboardService.replicationsSelectedVolumes.filter(
        (id) => id !== volumeId,
      );
    else this.NetAppDashboardService.replicationsSelectedVolumes.push(volumeId);
  }

  goToSingleReplication(volumeId) {
    this.NetAppDashboardService.replicationsSelectedVolumes = [volumeId];
    this.selectedReplicationsCheckboxes = { [volumeId]: true };
    return this.goToCreateReplications();
  }
}
