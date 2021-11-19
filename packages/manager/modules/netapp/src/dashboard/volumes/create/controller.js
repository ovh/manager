const MINIMUM_VOLUME_SIZE = 100;

export default class VolumeCreateCtrl {
  /* @ngInject */
  constructor($http, $translate) {
    this.$http = $http;
    this.$translate = $translate;
  }

  $onInit() {
    this.protocolList = this.protocolEnum.map((protocol) => ({
      key: this.$translate.instant(`netapp_volume_create_protocol_${protocol}`),
      value: protocol,
    }));

    [this.newVolumeProtocol] = this.protocolList;
    this.minimumVolumeSize = MINIMUM_VOLUME_SIZE;
    this.availableVolumeSize = this.getAvailableSize();
  }

  getAvailableSize() {
    const storageVolumesSize = this.volumes.reduce(
      (allSizes, volume) => allSizes + volume.size,
      0,
    );

    return this.storage.quota - storageVolumesSize;
  }

  onCreateVolume() {
    this.isCreating = true;
    this.trackClick('create::confirm');

    return this.$http
      .post(`/storage/netapp/${this.storage.id}/share`, {
        ...this.newVolume,
        protocol: this.newVolumeProtocol.value,
      })
      .then(({ data: volume }) =>
        this.goToVolumeDetails(
          volume.id,
          this.$translate.instant('netapp_volume_create_success'),
        ),
      )
      .catch((error) =>
        this.goToVolumes(
          this.$translate.instant('netapp_volume_create_error', {
            message: error.message,
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isCreating = false;
      });
  }

  goBack() {
    this.trackClick('create::cancel');
    return this.goToVolumes();
  }
}
