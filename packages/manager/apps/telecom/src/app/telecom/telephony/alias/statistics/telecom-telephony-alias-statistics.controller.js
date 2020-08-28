import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';

angular.module('managerApp').controller(
  'TelecomTelephonyAliasStatisticsCtrl',
  class TelecomTelephonyAliasStatisticsCtrl {
    constructor(
      $q,
      $state,
      $stateParams,
      $timeout,
      $translate,
      $uibModal,
      OvhApiTelephony,
      TucToast,
      tucVoipServiceAlias,
    ) {
      this.$q = $q;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.$uibModal = $uibModal;
      this.OvhApiTelephony = OvhApiTelephony;
      this.TucToast = TucToast;
      this.tucVoipServiceAlias = tucVoipServiceAlias;
    }

    $onInit() {
      this.loading = true;
      this.serviceInfos = {
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
      };

      return this.getQueueId()
        .then(() => {
          this.pollStats();
          return this.refreshStats();
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_statistics_fetch_error',
            )} ${get(error, 'data.message', error.message)}`,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    stopPoller() {
      if (this.poller) {
        this.$timeout.cancel(this.poller);
      }

      this.stopPolling = true;
    }

    getQueueId() {
      if (this.queue) {
        return this.$q.when();
      }
      return this.tucVoipServiceAlias
        .fetchContactCenterSolutionNumberQueues(this.serviceInfos)
        .then((queues) => {
          [this.queue] = queues;
        });
    }

    refreshStats() {
      return this.$q
        .all({
          agentsStatus: this.tucVoipServiceAlias
            .fetchContactCenterSolutionNumberAgentsStatus(
              this.serviceInfos,
              this.queue.queueId,
            )
            .then((agentsStatus) =>
              this.$q.all(
                agentsStatus.map((agentStatus) =>
                  this.OvhApiTelephony.EasyHunting()
                    .Hunting()
                    .Agent()
                    .v6()
                    .get({
                      ...this.serviceInfos,
                      agentId: agentStatus.agentId,
                    })
                    .$promise.then((agentInfo) => ({
                      ...agentInfo,
                      ...agentStatus,
                    })),
                ),
              ),
            ),
          calls: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberQueueCalls(
            this.serviceInfos,
            this.queue.queueId,
          ),
          stats: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberQueueStatistics(
            this.serviceInfos,
            this.queue.queueId,
          ),
        })
        .then(({ agentsStatus, calls, stats }) => {
          this.agentsStatus = agentsStatus;
          this.calls = calls;
          this.stats = stats;
        })
        .catch((error) => {
          this.TucToast.error(
            `${this.$translate.instant(
              'telephony_alias_statistics_fetch_error',
            )} ${get(error, 'data.message', error.message)}`,
          );
        });
    }

    pollStats() {
      const periodicRefresh = () => {
        this.refreshStats(this.queue.queueId).finally(() => {
          if (
            !this.stopPolling &&
            this.$state.current.name ===
              'telecom.telephony.billingAccount.alias.details.statistics'
          ) {
            this.poller = this.$timeout(periodicRefresh, 1000);
          } else {
            this.stopPoller();
          }
        });
      };
      this.$timeout(periodicRefresh, 1000);
    }

    // HELPERS
    getAverageWaitTime() {
      return this.stats.totalWaitingDuration / this.stats.callsTotal;
    }

    getAverageCallTime() {
      return this.stats.totalCallDuration / this.stats.callsAnswered;
    }

    getQoS() {
      // percentage rounded with two decimals
      return (
        Math.round((this.stats.callsAnswered / this.stats.callsTotal) * 10000) /
        100
      );
    }

    getOngoingCalls() {
      return this.calls.filter(
        (call) =>
          call && call.state === 'Answered' && call.answered && !call.end,
      );
    }

    getPendingCalls() {
      return this.calls.filter(
        (call) =>
          call && call.state === 'Waiting' && call.answered && !call.end,
      );
    }

    getMaxWaitTime() {
      let max = 0;
      let value = 0;

      const calls = this.getPendingCalls();
      calls.forEach(({ begin }) => {
        const elapsed = moment(begin).unix();
        if (elapsed > max) {
          max = elapsed;
          value = begin;
        }
      });

      return value;
    }

    getOnCallAgentsCount() {
      return this.agentsStatus.filter(({ status }) =>
        ['inAQueueCall', 'receiving'].includes(status),
      ).length;
    }

    getWaitingAgentsCount() {
      return this.agentsStatus.filter(({ status }) => status === 'waiting')
        .length;
    }
    // End of helpers

    actionOnCall(call, action) {
      this.$uibModal.open({
        animation: true,
        templateUrl: `components/telecom/telephony/alias/liveCalls/${action}/telecom-telephony-alias-configuration-liveCalls-${action}.html`,
        controller: `TelecomTelephonyAliasConfigurationLiveCalls${upperFirst(
          action,
        )}Ctrl`,
        controllerAs: '$ctrl',
        resolve: {
          params: () => ({
            billingAccount: this.serviceInfos.billingAccount,
            serviceName: this.serviceInfos.serviceName,
            callId: call.id,
            queueId: this.queue.queueId,
            apiEndpoint: this.OvhApiTelephony.EasyHunting(),
          }),
        },
      });
    }
  },
);
