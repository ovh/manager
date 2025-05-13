import map from 'lodash/map';
import 'moment';

export default class PciStoragesObjectStorageService {
  /* @ngInject */
  constructor($http, $q, Poller, OvhApiCloudProjectUser, coreConfig) {
    this.$http = $http;
    this.$q = $q;
    this.Poller = Poller;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
    this.coreConfig = coreConfig;
  }

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
      .then(({ data }) => data);
  }

  getS3Secret(projectId, userId, userAccess) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/user/${userId}/s3Credentials/${userAccess}/secret`,
      )
      .then(({ data }) => data);
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
          s3Credentials: data?.[0],
        }))
        .catch(() => null),
    );

    return this.$q.all(usersCredentialsPromises);
  }

  getS3Users(projectId) {
    this.OvhApiCloudProjectUser.v6().resetQueryCache();
    return this.getAllS3Users(projectId).then((users) =>
      this.getAndMapUsersHaveCredentials(projectId, users),
    );
  }

  getAndMapUsersHaveCredentials(projectId, users) {
    const usersCredentialsPromises = users.map((user) =>
      this.getS3Credentials(projectId, user.id).then((data) =>
        data.length > 0
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

  getCatalog() {
    return this.$http
      .get('/order/catalog/public/cloud', {
        params: {
          productName: 'cloud',
          ovhSubsidiary: this.coreConfig.getUser().ovhSubsidiary,
        },
      })
      .then(({ data: catalog }) => catalog);
  }
}
