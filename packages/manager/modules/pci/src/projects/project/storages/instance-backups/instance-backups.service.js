import map from 'lodash/map';
import InstanceBackup from './instance-backup.class';

export default class PciProjectStorageInstanceBackupService {
  /* @ngInject */
  constructor(
    $q,
    OvhApiCloudProject,
  ) {
    this.$q = $q;
    this.OvhApiCloudProject = OvhApiCloudProject;
  }

  getAll(projectId) {
    return this.OvhApiCloudProject
      .Snapshot()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise
      .then(instanceBackups => map(
        instanceBackups,
        instanceBackup => new InstanceBackup(instanceBackup),
      ));
  }

  get(projectId, instanceBackupId) {
    return this.OvhApiCloudProject
      .Snapshot()
      .v6()
      .get({
        serviceName: projectId,
        snapshotId: instanceBackupId,
      })
      .$promise
      .then(instanceBackup => new InstanceBackup(instanceBackup));
  }

  delete(projectId, { id }) {
    return this.OvhApiCloudProject
      .Snapshot()
      .v6()
      .delete({
        serviceName: projectId,
        snapshotId: id,
      })
      .$promise;
  }
}
