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
        stats: this.getStreamStats(projectId, stream.id),
      }))
      .then(({ stream, stats }) => new Stream({
        ...stream,
        stats,
      }));
  }

  getStreamStats(projectId, streamId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .v6()
      .getStats({
        serviceName: projectId,
        streamId,
      })
      .$promise;
  }

  getSubscriptions(projectId, streamId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Subscription()
      .v6()
      .query({
        serviceName: projectId,
        streamId,
      })
      .$promise
      .then(subscriptions => this.$q.all(
        subscriptions.map(
          subscriptionId => this.getSubscription(projectId, streamId, subscriptionId),
        ),
      ));
  }

  getSubscription(projectId, streamId, subscriptionId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Subscription()
      .v6()
      .get({
        serviceName: projectId,
        streamId,
        subscriptionId,
      })
      .$promise;
  }
}
