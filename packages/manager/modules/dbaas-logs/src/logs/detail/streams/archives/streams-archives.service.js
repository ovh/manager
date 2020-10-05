import set from 'lodash/set';

export default class LogsStreamsArchivesService {
  /* @ngInject */
  constructor($http, $q, LogsConstants, OvhApiDbaas, CucServiceHelper) {
    this.$http = $http;
    this.$q = $q;
    this.LogsConstants = LogsConstants;
    this.ArchivesApiService = OvhApiDbaas.Logs()
      .Archive()
      .v6();
    this.CucServiceHelper = CucServiceHelper;
  }

  /**
   * Get the IDs of all archives
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @returns promise which will resolve with a list of archive IDs
   * @memberof LogsStreamsArchivesService
   */
  getArchiveIds(serviceName, streamId) {
    return this.ArchivesApiService.query({
      serviceName,
      streamId,
    }).$promise.catch(
      this.CucServiceHelper.errorHandler('streams_archives_ids_loading_error'),
    );
  }

  /**
   * Gets the archive objects corresponding to the archiveIds
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @param {any} archiveIds - list of archive IDs for which archive objects are to be fetched
   * @returns promise which will be resolve with the list of archives
   * @memberof LogsStreamsArchivesService
   */
  getArchives(serviceName, streamId, archiveIds) {
    return this.getArchiveDetails(serviceName, streamId, archiveIds)
      .then((archives) => {
        archives.forEach((archive) => this.transformArchive(archive));
        return archives;
      })
      .catch(
        this.CucServiceHelper.errorHandler('streams_archives_loading_error'),
      );
  }

  /**
   * Gets the archive objects corresponding to the archiveIds
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @param {any} archiveIds - list of archive IDs for which archive objects are to be fetched
   * @returns promise which will be resolve with the list of archives
   * @memberof LogsStreamsArchivesService
   */
  getArchiveDetails(serviceName, streamId, archiveIds) {
    const promises = archiveIds.map((archiveId) =>
      this.getArchive(serviceName, streamId, archiveId),
    );
    return this.$q.all(promises);
  }

  /**
   * Gets the archive object corresponding to the archiveId
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @param {any} archiveId - the archive ID for which the archive object is to be fetched
   * @returns promise which will resolve with the archive
   * @memberof LogsStreamsArchivesService
   */
  getArchive(serviceName, streamId, archiveId) {
    return this.ArchivesApiService.get({ serviceName, streamId, archiveId })
      .$promise;
  }

  /**
   * Gets the download URL for an archive
   *
   * @param {any} serviceName
   * @param {any} streamId
   * @returns promise which will be resolve with the URL information for the archive
   * @memberof LogsStreamsArchivesService
   */
  getDownloadUrl(serviceName, streamId, archiveId) {
    return this.ArchivesApiService.url({
      serviceName,
      streamId,
      archiveId,
      expirationInSeconds: this.LogsConstants.expirationInSeconds,
    }).$promise.then((response) => response.data);
  }

  /**
   * Transforms the archive by adding additional information to it
   *
   * @param {any} archive
   * @memberof LogsStreamsArchivesService
   */
  transformArchive(archive) {
    set(
      archive,
      'retrievalStateType',
      this.LogsConstants.stateType[archive.retrievalState],
    );
  }
}
