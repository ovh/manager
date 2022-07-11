export default class {
  /* @ngInject */
  constructor($http, Poller, $q) {
    this.$http = $http;
    this.Poller = Poller;
    this.$q = $q;
  }

  getBuckets(serviceName, regionName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${regionName}/storage`)
      .then(({ data }) => data);
  }

  getBucketServices(serviceName, regionName, name) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${regionName}/storage/${name}`)
      .then(({ data }) => data);
  }

  createBucket(serviceName, regionName, bucket) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/storage`,
        bucket,
      )
      .then(({ data }) => data);
  }

  deleteBucket(serviceName, regionName, name) {
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/region/${regionName}/storage/${name}`,
      )
      .then(({ data }) => data);
  }

  getUsers(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/user`)
      .then(({ data }) => data);
  }

  getUser(serviceName, userId) {
    return this.$http
      .get(`/cloud/project/${serviceName}/user/${userId}`)
      .then(({ data }) => data);
  }

  createUser(serviceName, user) {
    return this.$http
      .post(`/cloud/project/${serviceName}/user`, user)
      .then(({ data }) => data);
  }

  deleteUser(serviceName, userId) {
    return this.$http
      .delete(`/cloud/project/${serviceName}/user/${userId}`)
      .then(({ data }) => data);
  }

  getUsersCredentials(serviceName, usersIds) {
    const promises = usersIds.map((userId) =>
      this.asCredentials(serviceName, userId),
    );
    return this.$q.all(promises).then((data) => data);
  }

  asCredentials(serviceName, userId) {
    return this.$http
      .get(`/cloud/project/${serviceName}/user/${userId}/s3Credentials`)
      .then(({ data }) => ({
        userId,
        asCredentials: data.length !== 0,
      }));
  }

  getS3Credentials(serviceName, userId) {
    return this.$http
      .get(`/cloud/project/${serviceName}/user/${userId}/s3Credentials`)
      .then(({ data }) => data);
  }

  getS3Credential(serviceName, userId, access) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/user/${userId}/s3Credentials/${access}`,
      )
      .then(({ data }) => data);
  }

  generateS3Credential(serviceName, userId) {
    return this.$http
      .post(`/cloud/project/${serviceName}/user/${userId}/s3Credentials`)
      .then(({ data }) => data);
  }

  deleteS3Credential(serviceName, userId) {
    return this.$http
      .delete(`/cloud/project/${serviceName}/user/${userId}/s3Credentials`)
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

  /**
   * Call this to stop the desired storages user task
   * @param namespace {String}: task name to stop
   */
  stopPollingUserStatus(namespace) {
    this.Poller.kill({ namespace });
  }
}
