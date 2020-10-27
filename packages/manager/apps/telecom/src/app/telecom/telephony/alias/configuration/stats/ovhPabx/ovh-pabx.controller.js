import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ function TelecomTelephonyAliasConfigurationStatsOvhPabxCtrl(
  $scope,
  $stateParams,
  $q,
  $timeout,
  OvhApiTelephony,
  TucToastError,
) {
  const self = this;
  let poller = null;
  let stopPolling = false;

  function init() {
    self.apiEndpoint = OvhApiTelephony.OvhPabx();
    self.queues = null;
    self.stats = {
      callsAnswered: 0,
      callsLost: 0,
      callsTotal: 0,
      totalCallDuration: 0,
      totalWaitingDuration: 0,
    };

    $scope.$on('$destroy', () => {
      if (poller) {
        $timeout.cancel(poller);
      }
      stopPolling = true;
    });

    self
      .fetchQueues()
      .then((queues) => {
        self.queues = queues;
      })
      .catch((err) => new TucToastError(err));

    self.pollGlobalStats();
  }

  self.fetchQueues = function fetchQueues() {
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((ids) =>
        $q.all(
          map(ids, (id) =>
            OvhApiTelephony.OvhPabx()
              .Hunting()
              .Queue()
              .v6()
              .get({
                billingAccount: $stateParams.billingAccount,
                serviceName: $stateParams.serviceName,
                queueId: id,
              })
              .$promise.then((queue) => {
                if (queue.actionOnOverflowParam) {
                  set(
                    queue,
                    'actionOnOverflowParam',
                    parseInt(queue.actionOnOverflowParam, 10),
                  );
                }
                return queue;
              }),
          ),
        ),
      );
  };

  self.fetchGlobalStats = function fetchGlobalStats() {
    const result = {
      callsAnswered: 0,
      callsLost: 0,
      callsTotal: 0,
      totalCallDuration: 0,
      totalWaitingDuration: 0,
    };
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((ids) =>
        $q.all(
          map(ids, (id) =>
            OvhApiTelephony.OvhPabx()
              .Hunting()
              .Queue()
              .v6()
              .getLiveStatistics({
                billingAccount: $stateParams.billingAccount,
                serviceName: $stateParams.serviceName,
                queueId: id,
              })
              .$promise.then((stats) => {
                result.callsAnswered += stats.callsAnswered;
                result.callsLost += stats.callsLost;
                result.callsTotal += stats.callsTotal;
                result.totalCallDuration += stats.totalCallDuration;
                result.totalWaitingDuration += stats.totalWaitingDuration;
              }),
          ),
        ),
      )
      .then(() => result);
  };

  self.pollGlobalStats = function pollGlobalStats() {
    const periodicRefresh = function periodicRefresh() {
      self
        .fetchGlobalStats()
        .then((stats) => {
          self.stats = stats;
        })
        .finally(() => {
          if (!stopPolling) {
            poller = $timeout(periodicRefresh, 2000);
          }
        });
    };
    $timeout(periodicRefresh, 2000);
  };

  self.getAverageWaitTime = function getAverageWaitTime() {
    return self.stats.totalWaitingDuration / self.stats.callsTotal;
  };

  self.getAverageCallTime = function getAverageCallTime() {
    return self.stats.totalCallDuration / self.stats.callsAnswered;
  };

  self.getQoS = function getQoS() {
    // percentage rounded with two decimals
    return (
      Math.round(
        (self.stats.callsAnswered / self.stats.callsTotal) * 100 * 100,
      ) / 100
    );
  };

  init();
}
