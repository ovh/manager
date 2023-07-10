import map from 'lodash/map';

export default class PciStoragesColdArchiveService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    Poller,
    coreConfig,
    OvhApiCloudProjectUser,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.Poller = Poller;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
    this.coreConfig = coreConfig;
  }

  /* ****** Manage S3 Users  ********** */
  getUserDetails(projectId, userId) {
    return this.$http
      .get(`/cloud/project/${projectId}/user/${userId}`)
      .then(({ data }) => data);
  }

  removeAllCredentials(projectId, userId, credentials) {
    return this.$q.all(
      map(credentials, (credential) =>
        this.$http.delete(
          `/cloud/project/${projectId}/user/${userId}/s3Credentials/${credential.access}`,
        ),
      ),
    );
  }

  getS3Credentials(projectId, userId) {
    return this.$http
      .get(`/cloud/project/${projectId}/user/${userId}/s3Credentials`)
      .then(({ data }) => {
        return data?.[0];
      });
  }

  getS3Secret(projectId, userId, userAccess) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/user/${userId}/s3Credentials/${userAccess}/secret`,
      )
      .then(({ data }) => {
        return data;
      });
  }

  createUser(projectId, description, role) {
    return this.$http
      .post(`/cloud/project/${projectId}/user`, { description, role })
      .then(({ data }) => data);
  }

  generateS3Credentials(projectId, userId) {
    return this.$http
      .post(`/cloud/project/${projectId}/user/${userId}/s3Credentials`)
      .then(({ data }) => data);
  }

  getAllS3Users(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/user`)
      .then(({ data }) => data);
  }

  mapUsersToCredentials(projectId, users) {
    const usersCredentialsPromises = users.map((user) =>
      this.getS3Credentials(projectId, user.id)
        .then((data) => ({
          ...user,
          s3Credentials: data,
        }))
        .catch(() => null),
    );
    return this.$q.all(usersCredentialsPromises);
  }

  getS3Users(projectId) {
    return this.getAllS3Users(projectId).then((users) =>
      this.getAndMapUsersHaveCredentials(projectId, users),
    );
  }

  getAndMapUsersHaveCredentials(projectId, users) {
    const usersCredentialsPromises = users.map((user) =>
      this.getS3Credentials(projectId, user.id).then((data) =>
        data
          ? {
              ...user,
              s3Credentials: data,
            }
          : undefined,
      ),
    );

    return this.$q
      .all(usersCredentialsPromises)
      .then((mappedUsers) => mappedUsers.filter((user) => !!user));
  }

  getUserStoragePolicy(projectId, userId) {
    return this.$http
      .get(`/cloud/project/${projectId}/user/${userId}/policy`)
      .then(({ data }) => data);
  }

  importUserPolicy(projectId, userId, policy) {
    return this.$http
      .post(`/cloud/project/${projectId}/user/${userId}/policy`, { policy })
      .then(({ data }) => data);
  }

  downloadRclone(projectId, { id: userId }, region, serviceType) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/user/${userId}/rclone?region=${region}&service=${serviceType}`,
      )
      .then(({ data }) => data);
  }

  get(projectId, userId) {
    return this.OvhApiCloudProjectUser.v6().get({
      serviceName: projectId,
      userId,
    }).$promise;
  }

  getRegions(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/region`, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
        },
      })
      .then(({ data }) => data);
  }

  getProductRegionsAvailability() {
    return this.$http
      .get(
        `/cloud/order/rule/availability?ovhSubsidiary=${
          this.coreConfig.getUser()?.ovhSubsidiary
        }&planCode=coldarchive.archive.hour.consumption`,
      )
      .then(({ data }) => {
        const regions = data?.plans[0]?.regions;
        return regions;
      })
      .catch(() => []);
  }

  /**
   * Call this to be informed where the desired status is on
   * @param serviceName {String}: concerned project
   * @param userId {String}: concerned user
   * @param status {String}: status to check
   * @param namespace {String}: action scope
   * @returns {Promise}: $http request promise
   */
  pollUserStatus(serviceName, userId, status, namespace) {
    return this.Poller.poll(
      `/cloud/project/${serviceName}/user/${userId}`,
      {},
      {
        namespace,
        method: 'get',
        successRule: (user) => user.status === status,
      },
    );
  }

  /* ****** Manage Archive containers  ********** */
  getArchiveContainers(serviceName, regionName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${regionName}/coldArchive`)
      .then(({ data }) =>
        data.map((container) => ({
          ...container,
          translatedStatus: this.$translate.instant(
            `pci_projects_project_storages_containers_status_${container.status}`,
          ),
        })),
      );
  }

  getArchiveRegionDetails(serviceName, regionName) {
    return this.$http.get(`/cloud/project/${serviceName}/region/${regionName}`);
  }

  createArchiveContainer(serviceName, regionName, coldArchive) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive`,
        coldArchive,
      )
      .then(({ data }) => data);
  }

  deleteArchiveContainer(serviceName, regionName, archiveName) {
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

  flushArchive(serviceName, regionName, archiveName) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}/destroy`,
      )
      .then(({ data }) => data);
  }

  deleteArchiveContainerObject(
    serviceName,
    regionName,
    archiveName,
    objectKey,
  ) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/region/${regionName}/coldArchive/${archiveName}/object/${objectKey}`,
      )
      .then(({ data }) => data);
  }

  deleteArchiveContainerObjects(serviceName, regionName, archiveName, objects) {
    const promises = objects.map(({ key }) => {
      return this.deleteArchiveContainerObject(
        serviceName,
        regionName,
        archiveName,
        key,
      );
    });

    return this.$q.all(promises).then(({ data }) => data);
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
