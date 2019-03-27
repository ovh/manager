export default class CloudProjectSSHKeyService {
  /* @ngInject */
  constructor(OvhApiCloudProjectSshKey) {
    this.OvhApiCloudProjectSshKey = OvhApiCloudProjectSshKey;
  }

  createSSHKey(serviceName, sshKey) {
    return this.OvhApiCloudProjectSshKey.v6().save({
      serviceName,
    }, sshKey).$promise;
  }

  getSSHKeys(serviceName) {
    return this.OvhApiCloudProjectSshKey.v6().query({
      serviceName,
    }).$promise;
  }
}
