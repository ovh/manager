import {
  COLD_ARCHIVE_CONTAINER_STATUS,
  COLD_ARCHIVE_CONTAINER_STATUS_LABEL,
} from './containers.constants';
import { COLD_ARCHIVE_TRACKING } from '../cold-archives.constants';

export default class PciStoragesColdArchiveContainersController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    $filter,
    CucCloudMessage,
    PciStoragesColdArchiveService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.$filter = $filter;
    this.CucCloudMessage = CucCloudMessage;
    this.PciStoragesColdArchiveService = PciStoragesColdArchiveService;

    this.USER_SUCCESS_BANNER =
      COLD_ARCHIVE_TRACKING.CONTAINERS.USER_SUCCESS_BANNER;
  }

  $onInit() {
    this.loadMessages();
    this.convertDate();
  }

  convertDate() {
    this.containers = this.containers.map((container) => ({
      ...container,
      gridPropertyCreationDate: new Date(container.createdAt),
      gridPropertyLockedUntil: new Date(container.lockedUntil),
    }));
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

  onManageContainerClick(container) {
    this.trackContainerslClick(
      COLD_ARCHIVE_TRACKING.CONTAINERS.MANAGE_CONTAINER,
    );
    return this.goToManageContainer(container);
  }

  onArchiveContainerClick(container) {
    this.trackContainerslClick(COLD_ARCHIVE_TRACKING.CONTAINERS.ARCHIVE);
    return this.goToArchiveContainer(container);
  }

  onRestoreContainerClick(container) {
    this.trackContainerslClick(COLD_ARCHIVE_TRACKING.CONTAINERS.RESTORE);
    return this.goToRestoreContainer(container);
  }

  onEditRetentionContainerClick(container) {
    this.trackContainerslClick(COLD_ARCHIVE_TRACKING.CONTAINERS.EDIT_RETENTION);
    return this.goToEditRetentionContainer(container);
  }

  onDeleteContainerClick(container) {
    this.trackContainerslClick(
      COLD_ARCHIVE_TRACKING.CONTAINERS.DELETE_CONTAINER,
    );
    return this.goToDeleteContainer(container);
  }

  onFlushContainerClick(container) {
    this.trackContainerslClick(
      COLD_ARCHIVE_TRACKING.CONTAINERS.FLUSH_CONTAINER,
    );
    return this.goToFlushArchive(container);
  }

  onAddUsertoContainerClick(container) {
    this.trackContainerslClick(COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER);
    return this.goToAddUserToContainer(container);
  }

  onAddContainerClick() {
    this.trackContainerslClick(COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER);
    return this.goToAddColdArchive();
  }

  static getStatusClass(status) {
    return COLD_ARCHIVE_CONTAINER_STATUS_LABEL[status.toUpperCase()];
  }

  static isActionsAvailable(container) {
    const Ctrl = PciStoragesColdArchiveContainersController;
    return [
      Ctrl.isActionAddUserAvailable(container),
      Ctrl.isActionArchiveAvailable(container),
      Ctrl.isActionRestoredAvailable(container),
      Ctrl.isActionFlushContainerAvailable(container),
      Ctrl.isActionEditRetentionContainerAvailable(container),
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

  static isActionEditRetentionContainerAvailable({ status }) {
    return [
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
    ].includes(status);
  }

  static isActionFlushContainerAvailable({ status, lockedUntil }) {
    const validStatuses = [
      COLD_ARCHIVE_CONTAINER_STATUS.ARCHIVED,
      COLD_ARCHIVE_CONTAINER_STATUS.RESTORED,
    ];

    if (lockedUntil) {
      return (
        new Date(lockedUntil) < new Date() && validStatuses.includes(status)
      );
    }

    return validStatuses.includes(status);
  }

  static isActionDeleteContainerAvailable({ status }) {
    return [
      COLD_ARCHIVE_CONTAINER_STATUS.NONE,
      COLD_ARCHIVE_CONTAINER_STATUS.FLUSHED,
    ].includes(status);
  }

  displayRestoreDate(container) {
    const { status, automaticDeletionAt } = container;
    if (
      status === COLD_ARCHIVE_CONTAINER_STATUS.RESTORED &&
      automaticDeletionAt
    ) {
      return this.$filter('date')(new Date(automaticDeletionAt), 'short');
    }
    return '';
  }

  onClipboardFieldClick({ tracking }) {
    this.trackClick(tracking);
  }
}
