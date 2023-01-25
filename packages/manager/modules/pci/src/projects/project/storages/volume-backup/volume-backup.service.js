export default class VolumeBackupService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  /**
   * list of volume backup
   * @param serviceName {string}: volume backup service name
   * @param regionName {string}:  volume backup region location
   * @returns {*}: volume backup list promise
   */
  getVolumeBackups(serviceName, regionName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${regionName}/volumeBackup`)
      .then(({ data }) => data);
  }

  /**
   * volume backup details
   * @param serviceName {string}: volume backup service name
   * @param regionName {string}:  volume backup region location
   * @returns {*}: volume backup details promise
   */
  getVolumeBackup(serviceName, regionName, volumeBackupId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/region/${regionName}/volumeBackup/${volumeBackupId}`,
      )
      .then(({ data }) => data);
  }

  /**
   * create a volume backup
   * @param serviceName {string}: volume backup service name
   * @param regionName {string}:  volume backup region location
   * @param volumeBackup {string}:  volume backup model details
   * @returns {*}: created volume backup details promise
   */
  createVolumeBackup(serviceName, regionName, volumeBackup) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/volumeBackup`,
        volumeBackup,
      )
      .then(({ data }) => data);
  }

  /**
   * remove a volume backup
   * @param serviceName {string}: volume backup service name
   * @param regionName {string}:  volume backup region location
   * @param volumeBackupId {string}:  volume backup id
   * @returns {*}: empty promise
   */
  deleteVolumeBackup(serviceName, regionName, volumeBackupId) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/region/${regionName}/volumeBackup/${volumeBackupId}`,
      )
      .then(({ data }) => data);
  }

  /**
   * restore volume backup to a volume
   * @param serviceName {string}: volume backup service name
   * @param regionName {string}:  volume backup region location
   * @param volumeBackupId {string}:  volume backup id
   * @returns {*}: volume backup details promise
   */
  restoreVolumeBackupToVolume(serviceName, regionName, volumeBackupId) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/volumeBackup/${volumeBackupId}/restore`,
      )
      .then(({ data }) => data);
  }

  /**
   * create a volume from a volume backup
   * @param serviceName {string}: volume backup service name
   * @param regionName {string}:  volume backup region location
   * @param volumeBackupId {string}:  volume backup id
   * @param name {string}:  desired volume name
   * @returns {*}: volume details promise
   */
  createVolumeFromVolumeBackup(serviceName, regionName, volumeBackupId, name) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/volumeBackup/${volumeBackupId}/volume`,
        { name },
      )
      .then(({ data }) => data);
  }
}
