import filter from 'lodash/filter';
import InstanceBackup from './instance-backup.class';

export default class PciProjectStorageInstanceBackupService {
  /* @ngInject */
  constructor($q, $http, OvhApiCloudProject, OvhApiCloudProjectInstance) {
    this.$q = $q;
    this.$http = $http;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
  }

  getAll(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/snapshot`)
      .then(({ data: instances }) =>
        instances.map((instance) => new InstanceBackup(instance)),
      );
  }

  get(projectId, instanceBackupId) {
    return this.OvhApiCloudProject.Snapshot()
      .v6()
      .get({
        serviceName: projectId,
        snapshotId: instanceBackupId,
      })
      .$promise.then((instanceBackup) => new InstanceBackup(instanceBackup));
  }

  delete(projectId, { id }) {
    return this.OvhApiCloudProject.Snapshot()
      .v6()
      .delete({
        serviceName: projectId,
        snapshotId: id,
      }).$promise;
  }

  getAssociatedInstances(projectId, { id }) {
    return this.OvhApiCloudProjectInstance.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((instances) => filter(instances, { imageId: id }));
  }
}
