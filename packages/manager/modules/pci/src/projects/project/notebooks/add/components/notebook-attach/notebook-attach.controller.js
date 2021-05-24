import { NOTEBOOK_ATTACH_STORAGE } from '../../notebook.constants';
import { NOTEBOOK_STORAGE_INFO } from '../../../Notebook.constants';
import Storage from '../../../Storage.class';

export default class NotebookAttachController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.Storage = Storage;

    this.NOTEBOOK_ATTACH_STORAGE = NOTEBOOK_ATTACH_STORAGE;
    this.permissions = [
      NOTEBOOK_ATTACH_STORAGE.PERMISSION_READ_ONLY,
      NOTEBOOK_ATTACH_STORAGE.PERMISSION_READ_WRITE,
    ];
  }

  canAttachVolumes() {
    return this.volumes.length;
  }

  addStorage(storage) {
    this.notebookModel.volumes.push(storage);
  }

  removeStorage(container) {
    const labelIndex = this.notebookModel.volumes.findIndex(
      (s) => s.id === container,
    );
    this.notebookModel.volumes.splice(labelIndex, labelIndex >= 0 ? 1 : 0);
  }

  onInlineAdderAddBtnClick(form) {
    this.addStorage(
      Storage.createStorageModel(
        form.storageContainer,
        JSON.parse(form.storageContainer.$modelValue),
        form.storageMountPath.$modelValue,
        form.storagePermission.$modelValue,
      ),
    );
  }

  onInlineAdderRemoveBtnClick(form) {
    this.removeStorage(form.storageContainer);
  }

  onGitRepositoryFieldChange(url) {
    try {
      this.notebookModel.mountPath = new URL(url).pathname;
    } catch (e) {
      this.notebookModel.pathMount = '';
    }
  }

  getStorageInfoLink() {
    return (
      NOTEBOOK_STORAGE_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      NOTEBOOK_STORAGE_INFO.DEFAULT
    );
  }
}
