import { VOLUME_BACKUP_TRACKING } from '../../volume-backup.constants';

const VOLUME_SIZE = {
  MIN: 10,
  MAX: 4000,
};

export default class VolumeBackupListCreateVolumeController {
  /* @ngInject */
  constructor($translate, ovhManagerRegionService, VolumeBackupService) {
    this.$translate = $translate;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.volumeBackupService = VolumeBackupService;

    this.VOLUME_SIZE = VOLUME_SIZE;
  }

  $onInit() {
    this.isCreating = false;
    this.createVolumeModel = {
      name: this.volume.name,
      size: this.volume.size || VOLUME_SIZE.MIN,
    };
  }

  onVolumeSizeChange(size) {
    this.getVolumePriceEstimation({
      ...this.volume,
      size,
    }).then((volumePrice) => {
      this.volumePrice = volumePrice;
    });
  }

  onCreateVolumeClick() {
    this.trackClick(VOLUME_BACKUP_TRACKING.CREATE_VOLUME.CTA_CONFIRM);

    this.isCreating = true;
    return this.volumeBackupService
      .createVolumeFromVolumeBackup(
        this.projectId,
        this.volumeBackup.region,
        this.volumeBackup.id,
        this.createVolumeModel.name,
      )
      .then(() => {
        this.trackPage(VOLUME_BACKUP_TRACKING.CREATE_VOLUME.REQUEST_SUCCESS);

        return this.goToVolumeBlockStorage(
          this.buildTaskResponse(
            'success',
            this.$translate.instant(
              'pci_projects_project_storages_volume_backup_list_create_volume_request_success',
              {
                volumeName: `<strong>${this.createVolumeModel.name}</strong>`,
              },
            ),
          ),
        );
      })
      .catch(({ data }) => {
        this.trackPage(VOLUME_BACKUP_TRACKING.CREATE_VOLUME.REQUEST_FAIL);

        return this.goToVolumeBlockStorage(
          this.buildTaskResponse(
            'error',
            this.$translate.instant(
              'pci_projects_project_storages_volume_backup_list_create_volume_request_fail',
              {
                volumeName: this.createVolumeModel.name,
                message: data.message,
              },
            ),
          ),
        );
      })
      .finally(() => {
        this.isCreating = false;
      });
  }

  onCreateVolumeCancelClick() {
    this.trackClick(VOLUME_BACKUP_TRACKING.CREATE_VOLUME.CTA_CANCEL);

    return this.goBack();
  }
}
