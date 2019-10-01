import first from 'lodash/first';
import Stream from './stream.class';

export default class PciProjectStreamService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectIo) {
    this.$q = $q;
    this.OvhApiCloudProjectIo = OvhApiCloudProjectIo;
  }

  getAll(projectId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise
      .then(streams => this.$q.all(
        streams.map(streamId => this.get(projectId, streamId)),
      ));
  }

  get(projectId, streamId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .v6()
      .get({
        serviceName: projectId,
        streamId,
      })
      .$promise
      .then(stream => this.$q.all({
        stream,
        stats: this.getStats(projectId, stream.id),
        region: this.getRegion(projectId, first(stream.regions)),
      }))
      .then(({ stream, stats, region }) => new Stream({
        ...stream,
        stats,
        region,
      }));
  }

  getStats(projectId, streamId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .v6()
      .getStats({
        serviceName: projectId,
        streamId,
      })
      .$promise;
  }

  getRegion(projectId, regionName) {
    return this.OvhApiCloudProjectIo
      .Capabilities()
      .Stream()
      .Region()
      .v6()
      .get({
        serviceName: projectId,
        regionName,
      })
      .$promise;
  }
}
