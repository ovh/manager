export default class NetappVolumesCreateReplicationsCtrl {
  /* @ngInject */ constructor(NetAppDashboardService) {
    this.destinationServiceId = undefined;
    this.hasAvailableReplicationsServices =
      NetAppDashboardService.hasAvailableReplicationsServices;
    this.optionsReplicationsAvaibleServices = [];
    this.onPostLoad = false;
    this.replicationsSelectedVolumes =
      NetAppDashboardService.replicationsSelectedVolumes;
  }

  $onInit() {
    this.optionsReplicationsAvaibleServices = this.replicationsAvaibleServices.map(
      ({ service: { id, name } }) => ({
        id,
        displayName: `${id} <br /> <small>${name}</small>`,
      }),
    );
  }

  onPrimaryClick() {
    if (!this.replicationsAvaibleServices.length) return this.goToOrder();
    if (this.replicationsSelectedVolumes.length && this.destinationServiceId) {
      this.onPostLoad = true;
      return this.postReplications({
        volumesIds: this.replicationsSelectedVolumes,
        destinationServiceId: this.destinationServiceId,
      }).then((resp) => {
        this.onPostLoad = false;
        // It will be remove in an other PR.
        console.info({ resp });
        return this.goToVolumes();
      });
    }
    return false;
  }

  isPrimaryButtonDisabled() {
    return (
      this.onPostLoad ||
      (this.hasAvailableReplicationsServices() && !this.destinationServiceId)
    );
  }
}
