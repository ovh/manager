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
      .then(subscription => new Subscription({
        ...subscription,
      }));
  }

  getStats(projectId, streamId, subscription) {
    return this.OvhApiCloudProjectIo
      .Stream()
      .Subscription()
      .v6()
      .getStats({
        serviceName: projectId,
        streamId,
        subscriptionId: subscription.id,
      })
      .$promise
      .then(stats => new Subscription({
        ...subscription,
        stats,
      }));
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
