import map from 'lodash/map';
import find from 'lodash/find';
import uniq from 'lodash/uniq';
import VolumeSnapshot from './snapshot.class';

export default class PciProjectStorageSnapshotsService {
  /* @ngInject */
  constructor($q, OvhApiCloudProject, OvhApiCloudProjectVolumeSnapshot) {
    this.$q = $q;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectVolumeSnapshot = OvhApiCloudProjectVolumeSnapshot;
  }

  getAll(projectId) {
    let snapshots;

    return this.OvhApiCloudProjectVolumeSnapshot.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((results) => {
        snapshots = [...results];
        const volumeIds = uniq(map(snapshots, (snapshot) => snapshot.volumeId));

        return this.$q.all(
          map(
            volumeIds,
            (volumeId) =>
              this.OvhApiCloudProject.Volume().v6().get({
                serviceName: projectId,
                volumeId,
              }).$promise,
          ),
        );
      })
      .then((volumes) =>
        map(
          snapshots,
          (snapshot) =>
            new VolumeSnapshot({
              ...snapshot,
              volume: find(volumes, { id: snapshot.volumeId }),
            }),
        ),
      );
  }

  get(projectId, snapshotId) {
    return this.OvhApiCloudProjectVolumeSnapshot.v6()
      .get({
        serviceName: projectId,
        snapshotId,
      })
      .$promise.then((snapshot) =>
        this.$q.all({
          snapshot,
          volume: this.getVolume(projectId, snapshot.volumeId),
        }),
      )
      .then(
        ({ snapshot, volume }) =>
          new VolumeSnapshot({
            ...snapshot,
            volume,
          }),
      );
  }

  getVolume(projectId, storageId) {
    return this.OvhApiCloudProject.Volume().v6().get({
      serviceName: projectId,
      volumeId: storageId,
    }).$promise;
  }

  delete(projectId, { id }) {
    return this.OvhApiCloudProjectVolumeSnapshot.v6().delete({
      serviceName: projectId,
      snapshotId: id,
    }).$promise;
  }

  createVolume(
    projectId,
    { description, imageId, name, region, size, snapshotId, type, bootable },
  ) {
    return this.OvhApiCloudProject.Volume().v6().save(
      {
        serviceName: projectId,
      },
      {
        description,
        imageId,
        name,
        region,
        size,
        snapshotId,
        type,
        bootable,
      },
    ).$promise;
  }
}
