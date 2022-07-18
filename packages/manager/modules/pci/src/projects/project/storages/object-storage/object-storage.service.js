import map from 'lodash/map';
import 'moment';

export default class PciStoragesObjectStorageService {
  /* @ngInject */
  constructor($http, $q, OvhApiCloudProjectUser) {
    this.$http = $http;
    this.$q = $q;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
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

  createUser(projectId, description) {
    return this.$http
      .post(`/cloud/project/${projectId}/user`, { description })
      .then(({ data }) => data);
  }

  generateS3Credentials(projectId, userId) {
    return this.$http
      .post(`/cloud/project/${projectId}/user/${userId}/s3Credentials`)
      .then(({ data }) => data);
  }

  getAllS3Users(projectId) {
    return this.OvhApiCloudProjectUser.v6().query({
      serviceName: projectId,
    }).$promise;
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

  downloadRclone(projectId, { id: userId }, region) {
    return this.$http
      .get(`/cloud/project/${projectId}/user/${userId}/rclone?region=${region}`)
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

  getStorageRegions(projectId, regionCapacity) {
    return this.getRegions(projectId).then((regions) => {
      return regions.filter(({ services }) =>
        services.find(({ name }) => name === regionCapacity),
      );
    });
  }
}
