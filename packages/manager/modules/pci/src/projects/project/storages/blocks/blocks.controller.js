import { VOLUME_HELP_PREFERENCE_KEY } from './block.constants';
import { getCriteria } from '../../project.utils';

export default class PciBlockStorageController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    CucRegionService,
    ovhUserPref,
    PciProjectStorageBlockService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.ovhUserPref = ovhUserPref;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.loadMessages();
    this.initLoaders();

    this.criteria = getCriteria('id', this.storageId);
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
}
