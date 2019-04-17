import get from 'lodash/get';

import { VOLUME_HELP_PREFERENCE_KEY } from './block.constants';

export default class PciBlockStorageController {
  /* @ngInject */
  constructor(
    $rootScope,
    $translate,
    CucCloudMessage,
    ovhUserPref,
    PciProjectStorageBlockService,
  ) {
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhUserPref = ovhUserPref;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
  }

  $onInit() {
    this.$rootScope.$on('pci_storages_blocks_refresh', () => this.refreshBlocks());
    this.initLoaders();
  }

  initLoaders() {
    this.loading = true;
    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.getBlocks())
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_blocks_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ))
      .then(() => this.checkHelpDisplay())
      .finally(() => {
        this.loading = false;
      });
  }

  getBlocks() {
    return this.PciProjectStorageBlockService
      .getAll(this.projectId)
      .then((storages) => {
        this.storages = storages;
        return this.storages;
      });
  }

  refreshBlocks() {
    this.loading = true;
    return this.getBlocks()
      .catch(err => this.CucCloudMessage.error(
        this.$translate.instant(
          'pci_projects_project_storages_blocks_error_query',
          { message: get(err, 'data.message', '') },
        ),
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.blocks');
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
        return this.ovhUserPref.getValue(this.getHelpPreferenceKey())
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

      this.ovhUserPref.assign(this.getHelpPreferenceKey(), false)
        .then()
        .finally(() => {
          this.updateHelp = false;
          this.displayHelp = null;
        });
    }
  }
}
