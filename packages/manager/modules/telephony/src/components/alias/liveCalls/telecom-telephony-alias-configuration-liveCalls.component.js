import _ from 'lodash';
import template from './telecom-telephony-alias-configuration-liveCalls.html';

import eavesdropCtrl from './eavesdrop/telecom-telephony-alias-configuration-liveCalls-eavesdrop.controller';
import eavesdropTpl from './eavesdrop/telecom-telephony-alias-configuration-liveCalls-eavesdrop.html';

import hangupCtrl from './hangup/telecom-telephony-alias-configuration-liveCalls-hangup.controller';
import hangupTpl from './hangup/telecom-telephony-alias-configuration-liveCalls-hangup.html';

import interceptCtrl from './intercept/telecom-telephony-alias-configuration-liveCalls-intercept.controller';
import interceptTpl from './intercept/telecom-telephony-alias-configuration-liveCalls-intercept.html';

import transfertCtrl from './transfer/telecom-telephony-alias-configuration-liveCalls-transfer.controller';
import transfertTpl from './transfer/telecom-telephony-alias-configuration-liveCalls-transfer.html';

export default {
  bindings: {
    apiEndpoint: '<',
    queueId: '<',
  },
  template,
  controller(
    $scope, $stateParams, $q, $timeout, $uibModal, $translate, $translatePartialLoader,
    moment, TucToastError,
  ) {
    const self = this;

    let poller = null;
    let stopPolling = false;

    self.$onInit = function $onInit() {
      self.isLoading = true;

      $scope.$on('$destroy', () => {
        if (poller) {
          $timeout.cancel(poller);
        }
        stopPolling = true;
      });

      $translatePartialLoader.addPart('../components/telecom/telephony/alias/liveCalls');
      $q.all([
        $translate.refresh(),
        self.getQueueId().then((queueId) => {
          self.queueId = queueId;
          self.pollStats(queueId);
          return self.refreshStats(queueId);
        }),
      ]).catch(err => new TucToastError(err)).finally(() => {
        self.isLoading = false;
      });
    };

    self.getQueueId = function getQueueId() {
      if (self.queueId) {
        return $q.when(self.queueId);
      }
      return self.apiEndpoint.Hunting().Queue().v6().query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise.then(ids => _.first(ids));
    };

    self.refreshStats = function refreshStats(queueId) {
      return $q.all({
        stats: self.fetchQueueLiveStatistics(queueId),
        calls: self.fetchQueueLiveCalls(queueId),
        agentsStatus: self.fetchAgentsLiveStatus(queueId),
      }).then((result) => {
        self.stats = result.stats;
        self.calls = result.calls;
        self.agentsStatus = result.agentsStatus;
      });
    };

    self.pollStats = function pollStats(queueId) {
      const periodicRefresh = function periodicRefresh() {
        self.refreshStats(queueId).finally(() => {
          if (!stopPolling) {
            poller = $timeout(periodicRefresh, 1000);
          }
        });
      };
      $timeout(periodicRefresh, 1000);
    };

    self.fetchQueueLiveStatistics = function fetchQueueLiveStatistics(queueId) {
      return self.apiEndpoint.Hunting().Queue().v6().getLiveStatistics({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId,
      }).$promise;
    };

    self.fetchQueueLiveCalls = function fetchQueueLiveCalls(queueId) {
      return self.apiEndpoint.Hunting().Queue().LiveCalls().v6()
        .query({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          queueId,
        }).$promise
        .then(callsIds => $q
          .all(_.map(
            (callsIds || []).reverse(),
            callId => self.apiEndpoint.Hunting().Queue().LiveCalls().v6()
              .get({
                billingAccount: $stateParams.billingAccount,
                serviceName: $stateParams.serviceName,
                queueId,
                id: callId,
              }).$promise,
          )));
    };

    self.fetchAgentsLiveStatus = function fetchAgentsLiveStatus(queueId) {
      self.apiEndpoint.Hunting().Queue().Agent().v6()
        .resetAllCache();
      return self.apiEndpoint.Hunting().Queue().Agent().v6()
        .query({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          queueId,
        }).$promise
        .then(agentIds => $q
          .all(_.map(
            agentIds,
            agentId => self.apiEndpoint.Hunting().Queue().Agent().v6()
              .getLiveStatus({
                billingAccount: $stateParams.billingAccount,
                serviceName: $stateParams.serviceName,
                queueId,
                agentId,
              }).$promise.then((agentStatus) => {
                _.set(agentStatus, 'agentId', agentId);
                return agentStatus;
              }),
          )));
    };

    self.getAverageWaitTime = function getAverageWaitTime() {
      return self.stats.totalWaitingDuration / self.stats.callsTotal;
    };

    self.getAverageCallTime = function getAverageCallTime() {
      return self.stats.totalCallDuration / self.stats.callsAnswered;
    };

    self.getQoS = function getQoS() {
      // percentage rounded with two decimals
      return Math.round((self.stats.callsAnswered / self.stats.callsTotal) * 100 * 100) / 100;
    };

    self.getOngoingCalls = function getOngoingCalls() {
      return _.filter(self.calls, call => call && call.state === 'Answered' && call.answered && !call.end);
    };

    self.getPendingCalls = function getPendingCalls() {
      return _.filter(self.calls, call => call && call.state === 'Waiting' && !call.answered && !call.end);
    };

    self.getMaxWaitTime = function getMaxWaitTime() {
      let max = 0;
      let value = 0;
      _.each(self.getPendingCalls(), (call) => {
        const elapsed = moment(call.begin).unix();
        if (elapsed > max) {
          max = elapsed;
          value = call.begin;
        }
      });
      return value;
    };

    self.getOnCallAgentsCount = function getOnCallAgentsCount() {
      return _.filter(self.agentsStatus, agent => agent.status === 'inAQueueCall' || agent.status === 'receiving').length;
    };

    self.getWaitingAgentsCount = function getWaitingAgentsCount() {
      return _.filter(self.agentsStatus, agent => agent.status === 'waiting').length;
    };

    self.interceptCall = function interceptCall(call) {
      $uibModal.open({
        animation: true,
        templateUrl: interceptTpl,
        controller: interceptCtrl,
        controllerAs: '$ctrl',
        resolve: {
          params() {
            return {
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
              callId: call.id,
              queueId: self.queueId,
              apiEndpoint: self.apiEndpoint,
            };
          },
        },
      });
    };

    self.hangupCall = function hangupCall(call) {
      $uibModal.open({
        animation: true,
        templateUrl: hangupTpl,
        controller: hangupCtrl,
        controllerAs: '$ctrl',
        resolve: {
          params() {
            return {
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
              callId: call.id,
              queueId: self.queueId,
              apiEndpoint: self.apiEndpoint,
            };
          },
        },
      });
    };

    self.transfertCall = function transfertCall(call) {
      $uibModal.open({
        animation: true,
        templateUrl: transfertTpl,
        controller: transfertCtrl,
        controllerAs: '$ctrl',
        resolve: {
          params() {
            return {
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
              callId: call.id,
              queueId: self.queueId,
              apiEndpoint: self.apiEndpoint,
            };
          },
        },
      });
    };

    self.eavesdropCall = function eavesdropCall(call) {
      $uibModal.open({
        animation: true,
        templateUrl: eavesdropTpl,
        controller: eavesdropCtrl,
        controllerAs: '$ctrl',
        resolve: {
          params() {
            return {
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
              callId: call.id,
              queueId: self.queueId,
              apiEndpoint: self.apiEndpoint,
            };
          },
        },
      });
    };
  },
};
