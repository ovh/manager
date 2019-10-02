import first from 'lodash/first';

import Stream from './stream.class';

export default class PciProjectStreamService {
  /* @ngInject */
  constructor(
    $q,
    OvhApiCloudProjectIo,
    PciProjectStreamsTokensService,
  ) {
    this.$q = $q;
    this.OvhApiCloudProjectIo = OvhApiCloudProjectIo;
    this.PciProjectStreamsTokensService = PciProjectStreamsTokensService;
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
      .then(stream => new Stream({
        ...stream,
      }));
  }

  getStats(projectId, stream) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .v6()
      .getStats({
        serviceName: projectId,
        streamId: stream.id,
      })
      .$promise
      .then(stats => new Stream({
        ...stream,
        stats,
      }));
  }

  getRegion(projectId, stream) {
    return this.OvhApiCloudProjectIo
      .Capabilities()
      .Stream()
      .Region()
      .v6()
      .get({
        serviceName: projectId,
        regionName: first(stream.regions),
      })
      .$promise
      .then(region => new Stream({
        ...stream,
        region,
      }));
  }

  delete(projectId, { id: streamId }) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .v6()
      .delete({
        serviceName: projectId,
        streamId,
      })
      .$promise;
  }

  update(projectId, {
    id: streamId,
    backlog,
    description,
    retention,
    throttling,
  }) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .v6()
      .edit(
        {
          serviceName: projectId,
          streamId,
        },
        {
          backlog,
          description,
          retention,
          throttling,
        },
      )
      .$promise;
  }

  getTokens(projectId, stream) {
    return this.PciProjectStreamsTokensService
      .getAll(projectId, stream)
      .then(tokens => new Stream({
        ...stream,
        tokens,
      }));
  }
}
