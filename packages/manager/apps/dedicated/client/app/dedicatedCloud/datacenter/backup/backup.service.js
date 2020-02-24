export default class {
  /* @ngInject */
  constructor($q, OvhApiDedicatedCloudDatacenter) {
    this.$q = $q;
    this.backupApi = OvhApiDedicatedCloudDatacenter.Backup().v6();
  }

  getBackup(serviceName, datacenterId) {
    return this.backupApi.get({ serviceName, datacenterId }).$promise;
  }
}
