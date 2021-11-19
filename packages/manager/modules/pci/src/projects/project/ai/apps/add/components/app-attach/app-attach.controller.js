import { APP_ATTACH_STORAGE } from '../../add.constants';
import { APP_STORAGE_INFO } from '../../../app.constants';
import Volume from '../../../Volume.class';

export default class AppAttachController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.APP_ATTACH_STORAGE = APP_ATTACH_STORAGE;
    this.permissions = [
      APP_ATTACH_STORAGE.PERMISSION_READ_ONLY,
      APP_ATTACH_STORAGE.PERMISSION_READ_WRITE,
    ];
  }

  getStorageInfoLink() {
    return (
      APP_STORAGE_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      APP_STORAGE_INFO.DEFAULT
    );
  }

  canAttachStorages() {
    return this.storages.length > 0;
  }

  maxVolumesIsReached() {
    if (!this.volumes) {
      return false;
    }
    return this.volumes.length >= APP_ATTACH_STORAGE.MAX_VOLUMES;
  }

  canAddNewVolume() {
    if (!this.volumes) {
      return true;
    }
    return (
      this.volumes.length === 0 ||
      !(this.maxVolumesIsReached() || this.appAttachForm.$invalid)
    );
  }

  canAddNewStorageVolume() {
    return this.canAttachStorages() && this.canAddNewVolume();
  }

  volumeMountPathExist(volume) {
    const foundVolume = this.volumes.find(
      ({ mountPath }) => volume.mountPath === mountPath,
    );
    return (
      this.volumes.length > 0 &&
      foundVolume !== undefined &&
      volume !== foundVolume
    );
  }

  addVolume(volume) {
    console.log(volume);
    this.volumes.push(volume);
  }

  removeVolume(volume) {
    const volumeIndex = this.volumes.findIndex((v) => v === volume);
    this.volumes.splice(volumeIndex, volumeIndex >= 0 ? 1 : 0);
  }

  onAddVolumeClick() {
    if (!this.maxVolumesIsReached()) {
      this.filterStorages();
      this.addVolume(Volume.createVolumeModel());
    }
  }

  onAddVolumeGitClick() {
    if (!this.maxVolumesIsReached()) {
      this.addVolume(Volume.createVolumeGitModel());
    }
  }

  onRemoveVolumeClick(volume) {
    this.removeVolume(volume);
  }

  onVolumeMountPathEdit(volume, volumeId) {
    if (this.volumeMountPathExist(volume)) {
      return this.appAttachForm[volumeId].$setValidity(
        'duplicateVolumeMountPath',
        false,
      );
    }

    return this.appAttachForm[volumeId].$setValidity(
      'duplicateVolumeMountPath',
      true,
    );
  }

  filterStorages() {
    this.filteredStorages = this.storages
      // Remove containers that are already on volume list
      .filter(({ name, region }) => {
        return !this.volumes
          .filter(({ privateSwift }) => privateSwift)
          .map(({ container }) => `${container.name}-${container.region}`)
          .includes(`${name}-${region}`);
      })
      .map(({ name, region }) => {
        return {
          name,
          region,
          description: `${name} - ${region}`,
        };
      });
  }
}
