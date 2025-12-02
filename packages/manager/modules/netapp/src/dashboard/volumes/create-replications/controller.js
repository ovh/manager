export default class NetappVolumesCreateReplicationsCtrl {
  /* @ngInject */ constructor(NetAppDashboardService) {
    this.replicationsSelectedVolumes =
      NetAppDashboardService.replicationsSelectedVolumes || [];
    this.destinationServiceId = undefined;
    this.hasAvailableReplicationsServices =
      NetAppDashboardService.hasAvailableReplicationsServices;
    this.optionsReplicationsAvaibleServices = [];
    this.onPostLoad = false;
  }

  $onInit() {
    this.optionsReplicationsAvaibleServices = this.replicationsAvaibleServices.map(
      ({ service: { id, name } }) => ({
        id,
        displayName: `${id} <br /> <small>${name}</small>`,
      }),
    );
    console.log('create 2', this);
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
