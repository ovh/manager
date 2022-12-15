import {
  COLD_ARCHIVE_CONTAINER_STATUS,
  CONTAINER_STATUS_OPTIONS,
} from './containers.constants';

export default class PciStoragesColdArchiveContainersController {
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
      archive: this.goToArchiveContainer,
      restore: this.goToRestoreContainer,
      delete: this.goToDeleteContainer,
    };
    return ACTIONS[action];
  }

  trackPage(page) {
    this.atInternet.trackPage({
      name: `${this.trackingPrefix}${page}`,
      type: 'navigation',
    });
  }

  static isActionsAvailable(container) {
    const Ctrl = PciStoragesColdArchiveContainersController;
    return [
      Ctrl.isActionAddUserAvailable(container),
      Ctrl.isActionSeeObjectsAvailable(container),
      Ctrl.isActionDeleteObjectsAvailable(container),
      Ctrl.isActionArchiveAvailable(container),
      Ctrl.isActionRestoredAvailable(container),
      Ctrl.isActionDeleteContainerAvailable(container),
      Ctrl.isActionDeleteArchiveAvailable(container),
    ].some((isActionAvailable) => isActionAvailable === true);
  }

  static isActionAddUserAvailable({ status }) {
    return [
      COLD_ARCHIVE_CONTAINER_STATUS.NONE,
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVING,
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORING,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
    ].includes(status);
  }

  static isActionSeeObjectsAvailable({ status }) {
    return [
      COLD_ARCHIVE_CONTAINER_STATUS.NONE,
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVING,
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORING,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
    ].includes(status);
  }

  static isActionDeleteObjectsAvailable({ status, objectsCount }) {
    return (
      objectsCount > 0 && [COLD_ARCHIVE_CONTAINER_STATUS.NONE].includes(status)
    );
  }

  static isActionArchiveAvailable({ status, objectsCount }) {
    return (
      objectsCount > 0 && [COLD_ARCHIVE_CONTAINER_STATUS.NONE].includes(status)
    );
  }

  static isActionRestoredAvailable({ status }) {
    return [COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED].includes(status);
  }

  static isActionDeleteContainerAvailable({ status, objectsCount }) {
    return (
      objectsCount === 0 &&
      [COLD_ARCHIVE_CONTAINER_STATUS.NONE].includes(status)
    );
  }

  static isActionDeleteArchiveAvailable({ status }) {
    return [
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
      COLD_ARCHIVE_CONTAINER_STATUS.FLUSHED,
    ].includes(status);
  }
}
