import compact from 'lodash/compact';
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

  getS3Users(projectId) {
    return this.OvhApiCloudProjectUser.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((users) =>
        this.$q
          .all(
            map(users, (user) =>
              this.getS3Credentials(projectId, user.id).then((data) =>
                data.length > 0
                  ? {
                      ...user,
                      s3Credentials: data,
                    }
                  : undefined,
              ),
            ),
          )
          .then((data) => compact(data)),
      );
  }

  getUserStoragePolicy(projectId, userId) {
    return this.$http
      .get(`/cloud/project/${projectId}/user/${userId}/policy`)
      .then(({ data }) => data);
  }
}
