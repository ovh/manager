import 'moment';

export default class PciStoragesColdArchiveService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  getArchiveContainers(serviceName, regionName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${regionName}/coldArchive`)
      .then(({ data }) => data);
  }

  createArchiveContainer(serviceName, regionName, coldArchive) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive`,
        coldArchive,
      )
      .then(({ data }) => data);
  }

  removeArchiveContainer(serviceName, regionName, archiveName) {
    return this.$http.delete(
      `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}`,
    );
  }

  getArchiveContainer(serviceName, regionName, archiveName) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}`,
      )
      .then(({ data }) => data);
  }

  startArchiveContainer(serviceName, regionName, archiveName) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}/archive`,
      )
      .then(({ data }) => data);
  }

  cleaningArchiveContainer(serviceName, regionName, archiveName) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}/destroy`,
      )
      .then(({ data }) => data);
  }

  destroyArchiveContainer(serviceName, regionName, archiveName, objectKey) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}/object/${objectKey}`,
      )
      .then(({ data }) => data);
  }

  createArchiveContainerPolicy(serviceName, regionName, archiveName, userId) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}/policy/${userId}`,
      )
      .then(({ data }) => data);
  }

  presignArchiveContainer(serviceName, regionName, archiveName) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}/presign`,
      )
      .then(({ data }) => data);
  }

  restoreArchiveContainer(serviceName, regionName, archiveName) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}/restore`,
      )
      .then(({ data }) => data);
  }
}
