import {
  COLD_ARCHIVE_CONTAINER_STATUS,
  CONTAINER_STATUS_OPTIONS,
  GUIDES,
} from './containers.constants';
import { COLD_ARCHIVE_TRACKING } from '../cold-archives.constants';

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
    this.initGuides(GUIDES).forEach((guide) => {
      this.guides.unshift(guide);
    });

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

  trackContainerslClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${action}`;
    return this.trackClick(hit);
  }

  onClickOnManageContainer(container) {
    this.trackContainerslClick(
      COLD_ARCHIVE_TRACKING.CONTAINERS.MANAGE_CONTAINER,
    );
    return this.goToManageContainer(container);
  }

  onClickOnArchiveContainer(container) {
    this.trackContainerslClick(COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE);
    return this.goToArchiveContainer(container);
  }

  onClickOnRestoreContainer(container) {
    this.trackContainerslClick(COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE);
    return this.goToRestoreContainer(container);
  }

  onClickOnDeleteContainer(container) {
    this.trackContainerslClick(
      COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER,
    );
    return this.goToDeleteContainer(container);
  }

  onClickOnFlushContainer(container) {
    this.trackContainerslClick(
      COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER,
    );
    return this.goToFlushArchive(container);
  }

  onClickOnAddUsertoContainer(container) {
    this.trackContainerslClick(COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER);
    return this.goToAddUserToContainer(container);
  }

  onClickOnAddContainer() {
    this.trackContainerslClick(COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER);
    return this.goToAddColdArchive();
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

  static isActionsAvailable(container) {
    const Ctrl = PciStoragesColdArchiveContainersController;
    return [
      Ctrl.isActionAddUserAvailable(container),
      Ctrl.isActionArchiveAvailable(container),
      Ctrl.isActionRestoredAvailable(container),
      Ctrl.isActionFlushContainerAvailable(container),
      Ctrl.isActionDeleteContainerAvailable(container),
    ].some((isActionAvailable) => isActionAvailable === true);
  }

  static isActionAddUserAvailable({ status }) {
    return [
      COLD_ARCHIVE_CONTAINER_STATUS.NONE,
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
    ].includes(status);
  }

  static isActionArchiveAvailable({ status, objectsCount }) {
    return (
      objectsCount > 0 && [COLD_ARCHIVE_CONTAINER_STATUS.NONE].includes(status)
    );
  }

  static isActionRestoredAvailable({ status }) {
    return [COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED].includes(status);
  }

  static isActionFlushContainerAvailable({ status }) {
    return [
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
    ].includes(status);
  }

  static isActionDeleteContainerAvailable({ status }) {
    return [
      COLD_ARCHIVE_CONTAINER_STATUS.NONE,
      COLD_ARCHIVE_CONTAINER_STATUS.FLUSHED,
    ].includes(status);
  }
}
