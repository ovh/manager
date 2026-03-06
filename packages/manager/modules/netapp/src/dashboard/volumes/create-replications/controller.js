export default class NetappVolumesCreateReplicationsCtrl {
  /* @ngInject */
  constructor(NetAppDashboardService, $translate) {
    this.optionsReplicationsAvaibleServices = [];
    this.onPostLoad = false;
    this.replicationsSelectedVolumes =
      NetAppDashboardService.replicationsSelectedVolumes;
    this.NetAppDashboardService = NetAppDashboardService;
    this.$translate = $translate;
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
    if (!this.replicationsAvaibleServices.length) {
      this.goToOrder();
    } else if (
      this.replicationsSelectedVolumes.length &&
      this.destinationServiceId
    ) {
      this.onPostLoad = true;
      this.postReplications({
        volumesIds: this.replicationsSelectedVolumes,
        destinationServiceId: this.destinationServiceId,
      }).then((resp = []) => {
        const errors = resp.reduce(
          (
            prev,
            {
              status,
              config: {
                data: { destinationServiceId, sourceShareId } = {},
              } = {},
            },
          ) =>
            status === 201
              ? prev
              : `${prev}<li>${this.$translate.instant(
                  'netapp_volumes_replications_errors',
                  { destinationServiceId, sourceShareId },
                )}</li>`,
          '',
        );

        const message = errors.length ? `<ul>${errors}</ul>` : undefined;
        const type = message ? 'warning' : 'success';

        return this.goToVolumes(message, type, true);
      });
    }
  }

  isPrimaryButtonDisabled() {
    return (
      this.onPostLoad ||
      (this.hasAvailableReplicationsServices && !this.destinationServiceId)
    );
  }
}
