import VolumeBackup from './volume-backup.class';

export default class VolumeBackupService {
  /* @ngInject */
  constructor($http, Poller, PciProject) {
    this.$http = $http;
    this.poller = Poller;
    this.PciProject = PciProject;
  }

  /**
   * list of all volume backup on all region backup
   * @param serviceName {string}: volume backup service name
   * @returns {*}: volume backup list promise
   */
  getVolumeBackupsOnAllRegions(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/aggregated/volumeBackup`)
      .then(({ data }) => data);
  }

  /**
   * list of volume backup
   * @param serviceName {string}: volume backup service name
   * @param regionName {string}:  volume backup region location
   * @returns {*}: volume backup list promise
   */
  getRegionVolumeBackups(serviceName, regionName) {
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
  restoreVolumeBackupToVolume(
    serviceName,
    regionName,
    volumeBackupId,
    volumeId,
  ) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/volumeBackup/${volumeBackupId}/restore`,
        { volumeId },
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

  /**
   * Get volumes list
   * @param serviceName {string}: project id
   * @returns {Promise}: block storage volumes list Promise
   */
  getVolumes(serviceName, customerRegions) {
    return this.$http
      .get(`/cloud/project/${serviceName}/volume`)
      .then(({ data }) => {
        const localZones = this.PciProject.getLocalZones(customerRegions);
        return data.map((volume) => {
          const isLocalZone = this.PciProject.checkIsLocalZone(
            localZones,
            volume.region,
          );
          return { ...volume, isLocalZone };
        });
      });
  }

  /**
   * Detach a volume from instance
   * @param serviceName {string}: project id
   * @param volumeId {string}: volume to detach
   * @param instanceId {string}: instance from where to detach the volume
   * @returns {Promise}: detach volume Promise
   */
  detachVolumeFromInstance(serviceName, volumeId, instanceId) {
    return this.$http
      .post(`/cloud/project/${serviceName}/volume/${volumeId}/detach`, {
        instanceId,
      })
      .then(({ data }) => data);
  }

  /**
   * Attach a volume to an instance
   * @param serviceName {string}: project id
   * @param volumeId {string}: volume to attach
   * @param instanceId {string}: instance where to attach the volume
   * @returns {Promise}: attach volume Promise
   */
  attachVolumeToInstance(serviceName, volumeId, instanceId) {
    return this.$http
      .post(`/cloud/project/${serviceName}/volume/${volumeId}/attach`, {
        instanceId,
      })
      .then(({ data }) => data);
  }

  /**
   * Get volume details
   * @param serviceName {string}: project id
   * @param volumeId {string}: block storage volume id
   * @returns {Promise}: block storage volume details Promise
   */
  getVolumeDetails(serviceName, volumeId) {
    return this.$http
      .get(`/cloud/project/${serviceName}/volume/${volumeId}`)
      .then(({ data }) => data);
  }

  /**
   * create a volume snapshot backup
   * @param serviceName {string}: volume snapshot service name
   * @param volumeId {string}:  volume UUID to back up
   * @param volumeBackup {string}:  volume snapshot model details
   * @returns {*}: created volume snapshot details promise
   */
  createVolumeSnapshot(serviceName, volumeId, volumeBackup) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/volume/${volumeId}/snapshot`,
        volumeBackup,
      )
      .then(({ data }) => data);
  }

  /**
   * Get instance details
   * @param serviceName {string}: project id
   * @param instanceId {string}: instance id
   * @returns {Promise}: instance details Promise
   */
  getInstanceDetails(serviceName, instanceId) {
    return this.$http
      .get(`/cloud/project/${serviceName}/instance/${instanceId}`)
      .then(({ data }) => data);
  }

  static buildPollingNameSpace(projectId, regionName, volumeBackupId) {
    return `volume_backup_${projectId}_${regionName}_${volumeBackupId}`;
  }

  /**
   * start volume-backup instance polling
   * @param projectId {string}: UUID to identify the project
   * @param regionName {string}: where the volume backup is located
   * @param volumeBackupId {string}: UUID to identifie the volume backup
   * @returns {Promise}: polling promise
   */
  startVolumeBackupPolling(projectId, regionName, volumeBackupId) {
    return this.poller.poll(
      `/cloud/project/${projectId}/region/${regionName}/volumeBackup/${volumeBackupId}`,
      {},
      {
        namespace: VolumeBackupService.buildPollingNameSpace(
          projectId,
          regionName,
          volumeBackupId,
        ),
        method: 'get',
        interval: 3500,
        successRule: (volumeBackup) =>
          !new VolumeBackup(volumeBackup).isPendingStatus,
      },
    );
  }

  /**
   * stop volume-backup instance polling
   * @param projectId {string}: UUID to identify the project
   * @param regionName {string}: where the volume backup is located
   * @param volumeBackupId {string}: UUID to identifie the volume backup
   * @returns {Promise}: polling promise
   */
  stopVolumeBackupPolling(projectId, regionName, volumeBackupId) {
    this.poller.kill({
      namespace: VolumeBackupService.buildPollingNameSpace(
        projectId,
        regionName,
        volumeBackupId,
      ),
    });
  }
}
