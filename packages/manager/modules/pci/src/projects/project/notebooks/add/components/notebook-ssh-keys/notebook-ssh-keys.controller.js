import { NOTEBOOK_ATTACH_SSH_KEYS } from '../../notebook.constants';

export const CUSTOM_SELECT = '-';

export default class NotebookSshKeysController {
  /* @ngInject */
  constructor(coreConfig, NotebookService) {
    this.NotebookService = NotebookService;

    this.coreConfig = coreConfig;
    // Option set by user indicating if he wants to add ssh keys
    this.enabledSshPublicKey = false;
    // List of ssh keys added by user
    this.addedSshKeys = [];
    // Saved ssh keys in public cloud
    this.savedKeys = [];
    // All available names for saved ssh keys
    this.allKeyNames = [];
    // Maximum number of ssh keys that user can attach
    this.MAX_SSH_KEYS = NOTEBOOK_ATTACH_SSH_KEYS.MAX;
  }

  $onInit() {
    this.populateSavedSshKeys();
  }

  canAddNewSshPublicKey() {
    const allSshKeys = this.getAllSshKeys();
    return (
      allSshKeys.length === this.addedSshKeys.length &&
      allSshKeys.length <= this.MAX_SSH_KEYS
    );
  }

  addNewSshPublicKey() {
    this.addedSshKeys.push({
      disabled: false,
      placeHolder: 'ssh-rsa AAAAB3...',
      model: null,
      keyName: CUSTOM_SELECT,
    });
  }

  onSshPublickeysDeleteBtnClick(index) {
    this.addedSshKeys.splice(index, 1);
  }

  changeEnabledSshPublicKey(enabledSshPublicKey) {
    this.enabledSshPublicKey = enabledSshPublicKey;
    if (!this.enabledSshPublicKey) {
      this.addedSshKeys = [];
    } else {
      this.addNewSshPublicKey();
    }
  }

  // Return all non empty ssh keys
  getAllSshKeys() {
    return this.addedSshKeys
      .map((x) => x.model)
      .filter((x) => x && x.length !== 0 && x.trim());
  }

  changeSavedSshKey(index) {
    // Get the select key name from the index
    const newSshKeyName = this.addedSshKeys[index].keyName;
    // Find the selected key by name
    if (newSshKeyName === CUSTOM_SELECT) {
      this.addedSshKeys[index].model = null;
      this.addedSshKeys[index].disabled = false;
    } else {
      const newSshKey = this.savedKeys.filter(
        (x) => x.name === newSshKeyName,
      )[0].publicKey;
      this.addedSshKeys[index].model = newSshKey;
      this.addedSshKeys[index].disabled = true;
    }
    this.textareaChanged();
  }

  populateSavedSshKeys() {
    this.NotebookService.getSavedSshKeys(this.projectId).then((keys) => {
      this.savedKeys = keys;
      this.allKeyNames = [CUSTOM_SELECT].concat(keys.map((x) => x.name));
    });
  }

  textareaChanged() {
    this.notebookModel.sshPublicKeys = this.getAllSshKeys();
    console.log(this.notebookModel);
  }
}
