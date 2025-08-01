export default class LogsEncryptionKeysService {
  /* @ngInject */
  constructor($http, $q, iceberg, LogsHelperService) {
    this.$http = $http;
    this.$q = $q;
    this.iceberg = iceberg;
    this.LogsHelperService = LogsHelperService;
  }

  /**
   * Retrieve list of encryptions keys with pagination, sorts, filters etc.
   * @param serviceName string LDP service name
   * @param offset int Offset to start from
   * @param pageSize int Number of results to retrieve from API
   * @param sort string Name of field to sort from
   * @param filters Array List of Iceberg filters to apply
   * @return {Object}
   */
  getPaginatedEncryptionKeys(
    serviceName,
    offset = 0,
    pageSize = 25,
    sort = { name: 'nbArchive', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(`/dbaas/logs/${serviceName}/encryptionKey`)
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
      data: response.data,
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
      },
    }));
  }

  /**
   * Retrieve full list (non-paginated) of encryptions keys, UUID only
   * @param serviceName string LDP service name
   * @return {[string]} List of encryption keys UUID
   */
  getEncryptionKeysIds(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/encryptionKey`)
      .query()
      .execute()
      .$promise.then(({ data }) => data)
      .catch((error) => {
        this.LogsHelperService.handleError(
          'logs_encryption_keys_get_error',
          error.data,
        );
        return [];
      });
  }

  /**
   * Retrieve full list (non-paginated) of encryptions keys with their details
   * @param serviceName string LDP service name
   * @return {[string]} List of encryption keys objects
   */
  getEncryptionKeys(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/encryptionKey`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then((response) => ({
        data: response.data,
      }));
  }

  /**
   * Delete an encryption key on the API side
   * @param serviceName string LDP service name
   * @param encryptionKey Object Encryption key object to remove
   * @return {Promise<any>}
   */
  deleteEncryptionKey(serviceName, encryptionKey) {
    return this.$http.delete(
      `/dbaas/logs/${serviceName}/encryptionKey/${encryptionKey.encryptionKeyId}`,
    );
  }

  /**
   * Create an encryption key on the API side
   * @param serviceName string LDP service name
   * @param encryptionKey Object Encryption key creation payload
   * @return {Promise<any>}
   */
  createEncryptionKey(serviceName, encryptionKey) {
    return this.$http.post(
      `/dbaas/logs/${serviceName}/encryptionKey`,
      encryptionKey,
    );
  }

  /**
   * Retrieve the list of encryption keys used to encrypt a given archive
   * @param serviceName string LDP service name
   * @param streamId UUID of the stream's archive
   * @param archiveId UUID of the archive
   * @return {[string]} List of encryption keys UUID
   */
  getArchiveEncryptionKeys(serviceName, streamId, archiveId) {
    return this.iceberg(
      `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/archive/${archiveId}/encryptionKey`,
    )
      .query()
      .execute()
      .$promise.then(({ data }) => data);
  }
}
