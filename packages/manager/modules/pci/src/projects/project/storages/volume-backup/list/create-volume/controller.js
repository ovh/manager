import pick from 'lodash/pick';
import BlockStorage from '../../../blocks/block.class';
import { VOLUME_BACKUP_TRACKING } from '../../volume-backup.constants';

export default class VolumeBackupListCreateVolumeController {
  /* @ngInject */
  constructor($translate, VolumeBackupService) {
    this.$translate = $translate;
    this.volumeBackupService = VolumeBackupService;
  }

  $onInit() {
    this.isCreating = false;
    this.storage = new BlockStorage({
      ...pick(this.volume, ['region', 'name', 'size', 'type']),
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
        this.storage.name,
      )
      .then(() => {
        this.trackPage(VOLUME_BACKUP_TRACKING.CREATE_VOLUME.REQUEST_SUCCESS);

        return this.goToVolumeBlockStorage(
          this.buildTaskResponse(
            'success',
            this.$translate.instant(
              'pci_projects_project_storages_volume_backup_list_create_volume_request_success',
              {
                volumeName: `<strong>${this.storage.name}</strong>`,
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
                volumeName: this.storage.name,
                message: data?.message,
              },
            ),
          ),
        );
      })
      .finally(() => {
        this.isCreating = false;
      });
  }
}
