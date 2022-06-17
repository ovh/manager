export default class {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
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
}
