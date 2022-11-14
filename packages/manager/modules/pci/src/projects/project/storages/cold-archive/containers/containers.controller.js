import { CONTAINER_STATUS_OPTIONS } from './containers.constants';

export default class PciStoragesContainersUsersController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucCloudMessage,
    PciStoragesColdArchiveService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.cold-archive.containers',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  // eslint-disable-next-line class-methods-use-this
  getStatusActions(status) {
    const { actions } = CONTAINER_STATUS_OPTIONS[status];
    return actions;
  }

  // eslint-disable-next-line class-methods-use-this
  getStatusClass(status) {
    const { componentClass } = CONTAINER_STATUS_OPTIONS[status];
    return componentClass;
  }

  getAction(action) {
    const ACTIONS = {
      archive: this.archiveContainer,
      restore: this.restaureContainer,
      delete: this.deleteContainer,
    };
    return ACTIONS[action];
  }

  trackPage(page) {
    this.atInternet.trackPage({
      name: `${this.trackingPrefix}${page}`,
      type: 'navigation',
    });
  }
}
