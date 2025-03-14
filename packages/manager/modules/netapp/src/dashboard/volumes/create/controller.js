import {
  MINIMUM_VOLUME_SIZE,
  MOUNT_PATH_PATTERN,
  MAX_CHAR_LIMIT,
  CUSTOM_SELECTION,
} from '../../constants';

export default class VolumeCreateCtrl {
  /* @ngInject */
  constructor($http, $translate, NetAppDashboardService) {
    this.$http = $http;
    this.$translate = $translate;
    this.NetAppDashboardService = NetAppDashboardService;
    this.MOUNT_PATH_PATTERN = MOUNT_PATH_PATTERN;
    this.MAX_CHAR_LIMIT = MAX_CHAR_LIMIT;
    this.CUSTOM_SELECTION = CUSTOM_SELECTION;
  }

  $onInit() {
    this.isLoading = true;
    this.manualSnaphost = [
      {
        key: this.CUSTOM_SELECTION,
      },
    ];
    this.protocolList = this.protocolEnum.map((protocol) => ({
      key: this.$translate.instant(`netapp_volume_create_protocol_${protocol}`),
      value: protocol,
    }));

    [this.newVolumeProtocol] = this.protocolList;
    this.minimumVolumeSize = MINIMUM_VOLUME_SIZE;
    this.availableVolumeSize = this.getAvailableSize();
    this.usedMountPaths = this.volumes
      .map(({ path }) => path?.map((p) => p?.split('/')[1]))
      .flat();
    // Eligible volumes will have size within total available size
    this.eligibleVolumes = this.volumes.filter(
      ({ size }) => size <= this.availableVolumeSize,
    );

    // Get all manual snapshots from Eligible volumes
    this.NetAppDashboardService.getManualsnapshots(
      this.eligibleVolumes,
      this.storage,
    ).then((result) => {
      this.isLoading = false;
      this.manualSnaphost = [...this.manualSnaphost, ...result.flat()];
    });
  }

  getAvailableSize() {
    const storageVolumesSize = this.volumes.reduce(
      (allSizes, volume) => allSizes + volume.size,
      0,
    );

    return this.storage.quota - storageVolumesSize;
  }

  onCreateVolume() {
    this.isLoading = true;
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
        this.isLoading = false;
      });
  }

  isMountPointNameAlreadyUsed(value) {
    if (!value || value === '') {
      return true;
    }
    return !this.usedMountPaths?.includes(value);
  }

  isLimitExceeds(value) {
    if (!value || value === '') {
      return true;
    }
    return value?.length <= this.MAX_CHAR_LIMIT;
  }

  goBack() {
    this.trackClick('create::cancel');
    return this.goToVolumes();
  }
}
