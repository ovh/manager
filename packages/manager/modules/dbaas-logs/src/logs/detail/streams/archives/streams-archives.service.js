import set from 'lodash/set';

export default class LogsStreamsArchivesService {
  /* @ngInject */
  constructor($http, $q, iceberg, LogsConstants, CucServiceHelper) {
    this.$http = $http;
    this.$q = $q;
    this.iceberg = iceberg;
    this.LogsConstants = LogsConstants;
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
  getPaginatedArchives(
    serviceName,
    streamId,
    offset = 0,
    pageSize = 25,
    sort = { name: 'filename', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(
      `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/archive`,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(offset)
      .sort(sort.name, sort.dir);
    if (filters !== null) {
      filters.forEach((filter) => {
        res = res.addFilter(filter.name, filter.operator, filter.value);
      });
    }
    return res.execute().$promise.then((response) => ({
      data: response.data.map((archive) => this.transformArchive(archive)),
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
      },
    }));
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
    return this.$http
      .get(
        `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/archive/${archiveId}`,
      )
      .then(({ data }) => this.transformArchive(data));
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
    return this.$http
      .post(
        `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/archive/${archiveId}/url`,
      )
      .then(({ data }) => data);
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
    return archive;
  }
}
