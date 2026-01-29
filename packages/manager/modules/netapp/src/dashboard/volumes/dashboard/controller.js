import {
  FOLDER_CREATION,
  PATTERN,
  REDHAT_COMMAND,
  UBUNTU_COMMAND,
} from './constants';
import { getFileSystemMountPath, saveMountPath } from './utils';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.REDHAT = REDHAT_COMMAND;
    this.UBUNTU = UBUNTU_COMMAND;
    this.FOLDER_CREATION = FOLDER_CREATION;
    this.PATTERN = PATTERN;
  }

  $onInit() {
    this.mountPath = getFileSystemMountPath(this.accessPath?.path);
    this.saveMountPath = saveMountPath(this.accessPath?.path);

    this.isEditing = {
      name: false,
      description: false,
    };

    if (this.volumeCapacityInfos) {
      this.volume = {
        ...this.volume,
        used: (
          this.volumeCapacityInfos.volume_size_used -
          this.volumeCapacityInfos.volume_snapshot_reserve_overflow
        )?.toFixed(2),
        available: this.volumeCapacityInfos.volume_size_available,
        overflow: this.volumeCapacityInfos.volume_snapshot_reserve_overflow,
      };
      this.snapshot = {
        size: this.volumeCapacityInfos.volume_snapshot_reserve_size,
        used: this.volumeCapacityInfos.volume_snapshot_reserve_used,
        available: this.volumeCapacityInfos.volume_snapshot_reserve_available
      };
    }
  }

  onEditNameClick() {
    this.isEditing.name = !this.isEditing.name;
  }

  onEditDescriptionClick() {
    this.isEditing.description = !this.isEditing.description;
  }

  update(property) {
    this.isEditing.name = false;
    this.isEditing.description = false;
    return this.updateVolume(this.volume)
      .then(() =>
        this.goToVolumeDashboard(
          this.$translate.instant(
            `netapp_volumes_dashboard_volume_${property}_update_success`,
          ),
        ),
      )
      .catch((error) =>
        this.goToVolumeDashboard(
          `${this.$translate.instant(
            `netapp_volumes_dashboard_volume_${property}_update_error`,
          )} ${error.data?.message}`,
          'error',
        ),
      );
  }
}
