import { NOTEBOOK_ATTACH_STORAGE } from '../../notebook.constants';
import { NOTEBOOK_STORAGE_INFO } from '../../../notebook.constants';
import Volume from '../../../Volume.class';

export default class NotebookAttachController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;

    this.NOTEBOOK_ATTACH_STORAGE = NOTEBOOK_ATTACH_STORAGE;
    this.permissions = [
      NOTEBOOK_ATTACH_STORAGE.PERMISSION_READ_ONLY,
      NOTEBOOK_ATTACH_STORAGE.PERMISSION_READ_WRITE,
    ];
  }

  getStorageInfoLink() {
    return (
      NOTEBOOK_STORAGE_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      NOTEBOOK_STORAGE_INFO.DEFAULT
    );
  }

  canAttachStorages() {
    return this.storages.length > 0;
  }

  maxVolumesIsReached() {
    return (
      this.notebookModel.volumes.length >= NOTEBOOK_ATTACH_STORAGE.MAX_VOLUMES
    );
  }

  canAddNewVolume() {
    return (
      this.canAttachStorages() &&
      (this.notebookModel.volumes.length === 0 ||
        !(this.maxVolumesIsReached() || this.notebookAttachForm.$invalid))
    );
  }

  volumeMountPathExist(volume) {
    const { volumes } = this.notebookModel;
    const foundVolume = volumes.find(
      ({ mountPath }) => volume.mountPath === mountPath,
    );
    return (
      volumes.length > 0 && foundVolume !== undefined && volume !== foundVolume
    );
  }

  addVolume(volume) {
    this.notebookModel.volumes.push(volume);
  }

  removeVolume(volume) {
    const volumeIndex = this.notebookModel.volumes.findIndex(
      (v) => v === volume,
    );
    this.notebookModel.volumes.splice(volumeIndex, volumeIndex >= 0 ? 1 : 0);
  }

  onAddVolumeClick() {
    if (!this.maxVolumesIsReached()) {
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
      return this.notebookAttachForm[volumeId].$setValidity(
        'duplicateVolumeMountPath',
        false,
      );
    }

    return this.notebookAttachForm[volumeId].$setValidity(
      'duplicateVolumeMountPath',
      true,
    );
  }
}
