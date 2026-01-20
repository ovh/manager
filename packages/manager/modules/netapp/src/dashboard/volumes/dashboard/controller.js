import {
  FOLDER_CREATION,
  PATTERN,
  REDHAT_COMMAND,
  UBUNTU_COMMAND,
} from './constants';
import { getFileSystemMountPath, saveMountPath } from './utils';

function getPercentage(value, total) {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(2));
}
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

    this.volume = {
      ...this.volume,
      used: (
        this.volumeCapacityInfos.volume_size_used -
        this.volumeCapacityInfos.volume_snapshot_reserve_overflow
      ).toFixed(2),
      available: this.volumeCapacityInfos.volume_size_available,
      overflow: this.volumeCapacityInfos.volume_snapshot_reserve_overflow,
      usedPercent: getPercentage(
        this.volumeCapacityInfos.volume_size_used,
        this.volumeCapacityInfos.volume_size,
      ),
      availablePercent: getPercentage(
        this.volumeCapacityInfos.volume_size_available,
        this.volumeCapacityInfos.volume_size,
      ),
      overflowPercent: getPercentage(
        this.volumeCapacityInfos.volume_snapshot_reserve_overflow,
        this.volumeCapacityInfos.volume_size,
      ),
    };

    this.snapshot = {
      size: this.volumeCapacityInfos.volume_snapshot_reserve_size,
      used: this.volumeCapacityInfos.volume_snapshot_reserve_used,
      available: this.volumeCapacityInfos.volume_snapshot_reserve_available,
      usedPercent: getPercentage(
        this.volumeCapacityInfos.volume_snapshot_reserve_used,
        this.volumeCapacityInfos.volume_size,
      ),
      availablePercent: getPercentage(
        this.volumeCapacityInfos.volume_snapshot_reserve_available,
        this.volumeCapacityInfos.volume_size,
      ),
    };
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
