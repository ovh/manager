import {
  VOLUME_BLOCK_TRACKING,
  VOLUME_HELP_PREFERENCE_KEY,
} from './block.constants';

export default class PciBlockStorageController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    ovhManagerRegionService,
    ovhUserPref,
    shellClient,
    PciProjectStorageBlockService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.ovhUserPref = ovhUserPref;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
    this.shellClient = shellClient;
  }

  $onInit() {
    this.loadMessages();
    this.initLoaders();

    this.criteria = this.storageId
      ? [
          {
            property: 'id',
            operator: 'is',
            value: this.storageId,
            title: this.storageId,
          },
        ]
      : [];

    if (this.taskResponse) {
      const { type, message } = this.taskResponse.cucCloudParams;
      this.taskResponse = null;
      this.CucCloudMessage[type](message);
    }
  }

  initLoaders() {
    this.loading = true;
    return this.$translate
      .refresh()
      .then(() => this.checkHelpDisplay())
      .finally(() => {
        this.loading = false;
      });
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.blocks',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  checkHelpDisplay() {
    return new Promise((resolve) => {
      if (this.help) {
        return this.ovhUserPref
          .getValue(this.getHelpPreferenceKey())
          .then((value) => {
            this.displayHelp = value && this.help;
          })
          .catch(() => {
            this.displayHelp = this.help;
          })
          .finally(() => resolve());
      }
      return resolve();
    });
  }

  getHelpPreferenceKey() {
    return `${VOLUME_HELP_PREFERENCE_KEY}${this.help.toUpperCase()}`;
  }

  onHelpClosed(type) {
    if (type === this.displayHelp) {
      this.displayHelp = null;
    }
  }

  hideHelp(type) {
    if (type === this.displayHelp) {
      this.updateHelp = true;

      this.ovhUserPref
        .assign(this.getHelpPreferenceKey(), false)
        .then()
        .finally(() => {
          this.updateHelp = false;
          this.displayHelp = null;
        });
    }
  }

  onAddStorageClick() {
    this.trackClick(VOLUME_BLOCK_TRACKING.LISTING.CTA_CREATE);

    return this.addStorage();
  }

  onEditStorageClick(storage) {
    this.trackClick(VOLUME_BLOCK_TRACKING.LISTING.ROW_CTA_EDIT);

    return this.editStorage(storage);
  }

  onAttachStorageClick(storage) {
    this.trackClick(VOLUME_BLOCK_TRACKING.LISTING.ROW_CTA_ATTACH);

    return this.attachStorage(storage);
  }

  onDetachStorageClick(storage) {
    this.trackClick(VOLUME_BLOCK_TRACKING.LISTING.ROW_CTA_DETACH_VOLUME);

    return this.detachStorage(storage);
  }

  onCreateBackupClick(storage) {
    this.trackClick(VOLUME_BLOCK_TRACKING.LISTING.ROW_CTA_CREATE_BACKUP);

    return this.goToCreateVolumeBackup(storage);
  }

  onDeleteStorageClick(storage) {
    this.trackClick(VOLUME_BLOCK_TRACKING.LISTING.ROW_CTA_DELETE);

    return this.deleteStorage(storage);
  }
}
