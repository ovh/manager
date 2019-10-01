import Subscription from './subscription.class';

export default class PciProjectStreamStreamSubscriptionsService {
  /* @ngInject */
  constructor($q, OvhApiCloudProjectIo) {
    this.$q = $q;
    this.OvhApiCloudProjectIo = OvhApiCloudProjectIo;
  }

  getAll(projectId, streamId) {
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
          subscriptionId => this.get(projectId, streamId, subscriptionId),
        ),
      ));
  }

  get(projectId, streamId, subscriptionId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Subscription()
      .v6()
      .get({
        serviceName: projectId,
        streamId,
        subscriptionId,
      })
      .$promise
      .then(subscription => this.$q.all({
        subscription,
        stats: this.getStats(projectId, streamId, subscription.id),
      }))
      .then(({ subscription, stats }) => new Subscription({
        ...subscription,
        stats,
      }));
  }

  getStats(projectId, streamId, subscriptionId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Subscription()
      .v6()
      .getStats({
        serviceName: projectId,
        streamId,
        subscriptionId,
      })
      .$promise;
  }

  add(projectId, streamId, name) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Subscription()
      .v6()
      .save({
        serviceName: projectId,
        streamId,
      }, {
        name,
      })
      .$promise;
  }

  delete(projectId, streamId, subscriptionId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Subscription()
      .v6()
      .delete({
        serviceName: projectId,
        streamId,
        subscriptionId,
      })
      .$promise;
  }

  resetCursor(projectId, streamId, subscriptionId) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Subscription()
      .v6()
      .resetCursor({
        serviceName: projectId,
        streamId,
        subscriptionId,
      }, null)
      .$promise;
  }
}
