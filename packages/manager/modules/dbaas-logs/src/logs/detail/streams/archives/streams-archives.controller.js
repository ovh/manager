import clone from 'lodash/clone';
import find from 'lodash/find';
import datagridToIcebergFilter from '../../logs-iceberg.utils';

export default class LogsStreamsArchivesCtrl {
  /* @ngInject */
  constructor(
    $interval,
    $state,
    $stateParams,
    $translate,
    ouiDatagridService,
    CucCloudMessage,
    CucControllerHelper,
    LogsStreamsService,
    LogsConstants,
    LogsStreamsArchivesService,
    LogsEncryptionKeysService,
  ) {
    this.$interval = $interval;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsConstants = LogsConstants;
    this.LogsStreamsArchivesService = LogsStreamsArchivesService;
    this.LogsEncryptionKeysService = LogsEncryptionKeysService;

    this.serviceName = this.$stateParams.serviceName;
    this.streamId = this.$stateParams.streamId;
    this.initLoaders();
  }

  $onInit() {
    this.stream.load();
    this.encryptionKeys.load();
    this.notifications = [];
    this.archivesEncryptionKeys = {};
  }

  $destroy() {
    this.stopRetrievalDelayUpdate();
  }

  /**
   * Gets the notificaiton index for an archive if available
   *
   * @param {any} archive
   * @returns the notification index. Returns -1 if not found
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  getNotificationIndex(archive) {
    return this.notifications.reduce(
      (matchedIndex, currentNotification, currentIndex) =>
        currentNotification.archive.archiveId === archive.archiveId
          ? currentIndex
          : matchedIndex,
      -1,
    );
  }

  /**
   * initializes the archivesIDs and current stream
   *
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  initLoaders() {
    this.stream = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getStream(this.serviceName, this.streamId),
    });
    this.encryptionKeys = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsEncryptionKeysService.getEncryptionKeys(this.serviceName),
    });
  }

  loadArchives({ offset, pageSize = 1, sort, criteria }) {
    this.stopRetrievalDelayUpdate();
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'filename';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsStreamsArchivesService.getPaginatedArchives(
      this.serviceName,
      this.streamId,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    )
      .then(this.startRetrievalDelayUpdate())
      .then((archivesData) => {
        archivesData.data.forEach((archive) => {
          this.updateUnfreezingNotification(archive);
          // Retrieve the encryption keys used to encrypt the archive, if it exists
          this.LogsEncryptionKeysService.getArchiveEncryptionKeys(
            this.serviceName,
            this.streamId,
            archive.archiveId,
          ).then((encryptionKeys) => {
            if (encryptionKeys.length > 0) {
              this.archivesEncryptionKeys[archive.archiveId] = [];
            }
            encryptionKeys.forEach((encryptionKeyId) => {
              this.archivesEncryptionKeys[archive.archiveId].push(
                find(this.encryptionKeys.data, {
                  encryptionKeyId,
                }).title,
              );
            });
          });
        });
        return archivesData;
      });
  }

  /**
   * Removes the notification for an archive if available
   *
   * @param {any} archive
   * @returns Returns the removed notification
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  removeNotification(archive) {
    const notificationIndex = this.getNotificationIndex(archive);
    return this.notifications.splice(
      notificationIndex,
      notificationIndex >= 0 ? 1 : 0,
    );
  }

  /**
   * Starts an interval that runs every second, that updates
   * the remaining unsealing time for all archives being unsealed
   *
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  startRetrievalDelayUpdate() {
    this.retrievalDelayUpdater = this.$interval(
      () => this.updateRetrievalDelay(),
      1000,
    );
  }

  /**
   * Stops the interval that updates the remaining unsealing
   * time for all archives being unsealed
   *
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  stopRetrievalDelayUpdate() {
    this.$interval.cancel(this.retrievalDelayUpdater);
  }

  /**
   * Updates the notification for an archive if available. Else adds the notification
   *
   * @param {any} archive
   * @param {any} notification
   * @returns Returns the updated/inserted notification
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  updateNotification(notification) {
    const notificationIndex = this.getNotificationIndex(notification.archive);
    if (notificationIndex >= 0) {
      this.notifications[notificationIndex] = notification;
    } else {
      this.notifications.push(notification);
    }
    return this.notifications;
  }

  /**
   * Loops through all archives and reduces the remaining unsealing
   * time for archives being unsealed. Also sets an archive to available
   * when the unsealing is complete and issues a notification
   *
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  updateRetrievalDelay() {
    clone(this.notifications).forEach((notification) => {
      const { archive } = notification;
      archive.retrievalDelay =
        archive.retrievalDelay > 0
          ? (archive.retrievalDelay -= 1)
          : archive.retrievalDelay;
      if (archive.retrievalState === this.LogsConstants.state.UNSEALING) {
        if (archive.retrievalDelay === 0) {
          archive.retrievalState = this.LogsConstants.state.UNSEALED;
          this.LogsStreamsArchivesService.transformArchive(archive);
        }
        this.updateUnfreezingNotification(archive);
      }
    });
  }

  /**
   * Updates the notification for an archive that is being unsealed.
   * If the archive is not being unsealed, the notification is removed
   *
   * @param {any} archive
   * @returns Returns the updated/removed notification
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  updateUnfreezingNotification(archive) {
    return archive.retrievalState === this.LogsConstants.state.UNSEALING
      ? [
          this.updateNotification({
            text: this.$translate.instant('streams_archives_unfreezing', {
              name: archive.filename,
              time: moment
                .utc(archive.retrievalDelay * 1000)
                .format('HH:mm:ss'),
            }),
            type: 'info',
            archive,
          }),
        ]
      : this.removeNotification(archive);
  }

  /**
   * Gets the URL for an archive and downloads it
   *
   * @param {any} archive
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  download(archive) {
    this.updateNotification({
      text: this.$translate.instant('streams_archives_preparing_download', {
        filename: archive.filename,
      }),
      type: 'info',
      archive,
    });
    this.CucControllerHelper.scrollPageToTop();
    this.archiveDownload = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsArchivesService.getDownloadUrl(
          this.serviceName,
          this.streamId,
          archive.archiveId,
        ),
    });

    this.archiveDownload.load().then((urlInfo) => {
      this.removeNotification(archive);
      this.CucControllerHelper.constructor.downloadUrl(urlInfo.url);
    });
  }

  /**
   * Starts the unsealing process for an archive and issues a notification
   * with the remaining time after which the archive would be available for download
   *
   * @param {any} archive
   * @memberof LogsStreamsArchivesHomeCtrl
   */
  unfreeze(archive) {
    this.updateNotification({
      text: this.$translate.instant('streams_archives_unfreeze_start', {
        filename: archive.filename,
      }),
      type: 'info',
      archive,
    });
    this.CucControllerHelper.scrollPageToTop();
    this.LogsStreamsArchivesService.getDownloadUrl(
      this.serviceName,
      this.streamId,
      archive.archiveId,
    )
      .then(() =>
        this.LogsStreamsArchivesService.getArchive(
          this.serviceName,
          this.streamId,
          archive.archiveId,
        ),
      )
      .then((updatedArchive) => {
        this.updateUnfreezingNotification(updatedArchive);
        this.ouiDatagridService.refresh('archives-datagrid', true);
      })
      .catch((err) => {
        this.updateNotification({
          text: this.$translate.instant('streams_archives_url_load_error', {
            filename: archive.filename,
            message: err,
          }),
          type: 'error',
          archive,
        });
      });
  }
}
