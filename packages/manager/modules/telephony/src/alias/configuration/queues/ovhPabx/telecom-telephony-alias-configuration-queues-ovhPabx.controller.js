angular.module('managerApp').controller('TelecomTelephonyAliasConfigurationQueuesOvhPabxCtrl', function ($stateParams, $q, $translate, $timeout, $uibModal, OvhApiTelephony, TucToast, TucToastError) {
  const self = this;

  function init() {
    self.queues = null;
    return $q.all({
      queues: self.fetchQueues(),
      agents: self.fetchAgents(),
      sounds: self.fetchSounds(),
      enums: self.fetchEnums(),
    }).then((result) => {
      self.enums = result.enums;
      self.queues = result.queues;
      self.agents = result.agents;
      self.sounds = result.sounds;
      if (self.queues.length) {
        _.first(self.queues).isOpen = true;
      }
    }).catch(err => new TucToastError(err));
  }

  self.fetchEnums = function () {
    return OvhApiTelephony.v6().schema().$promise.then(result => ({
      strategy: _.get(result, ['models', 'telephony.OvhPabxHuntingQueueStrategyEnum', 'enum']),
    }));
  };

  self.fetchQueues = function () {
    return OvhApiTelephony.OvhPabx().Hunting().Queue().v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise
      .then(ids => $q.all(_.map(ids, id => OvhApiTelephony.OvhPabx().Hunting().Queue().v6()
        .get({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          queueId: id,
        }).$promise.then((queue) => {
          if (queue.actionOnOverflowParam) {
            _.set(queue, 'actionOnOverflowParam', parseInt(queue.actionOnOverflowParam, 10));
          }
          return self.bindQueueAgentsApi(queue);
        }))));
  };

  self.bindQueueAgentsApi = function (queue) {
    _.set(queue, 'agentsApi', {
      getMemberList: angular.noop, // api provided by component
      addMembersToList: angular.noop, // api provided by component
      fetchMembers() {
        return self.fetchAgentsOfQueue(queue);
      },
      reorderMembers(agents) {
        return self.reorderAgentsOfQueue(queue, agents);
      },
      fetchMemberDescription: self.fetchAgentDescription,
      swapMembers(from, to) {
        return self.swapAgentsOfQueue(queue, from, to);
      },
      updateMember: self.updateAgent,
      deleteMember(agent) {
        return self.deleteAgentFromQueue(queue, agent);
      },
    });
    return queue;
  };

  self.fetchSounds = function () {
    return OvhApiTelephony.OvhPabx().Sound().v6().query({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise.then(ids => $q.all(_.map(ids, id => OvhApiTelephony.OvhPabx().Sound().v6().get({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
      soundId: id,
    }).$promise)));
  };

  self.findSoundById = function (soundId) {
    return _.find(self.sounds, { soundId: parseInt(`${soundId}`, 10) });
  };

  self.fetchAgents = function () {
    return OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise
      .then(ids => $q
        .all(_.map(
          _.chunk(ids, 50),
          chunkIds => OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
            .getBatch({
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
              agentId: chunkIds,
            }).$promise,
        ))
        .then(chunkResult => _.pluck(_.flatten(chunkResult), 'value')));
  };

  self.fetchAgentsOfQueue = function (queue) {
    return OvhApiTelephony.OvhPabx().Hunting().Queue().Agent()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId: queue.queueId,
      }).$promise
      .then(ids => $q
        .all(_.map(
          _.chunk(ids, 50),
          chunkIds => OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
            .getBatch({
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
              agentId: chunkIds,
            }).$promise,
        )).then(chunkResult => _.pluck(_.flatten(chunkResult), 'value')));
  };

  self.fetchAgentDescription = function (agent) {
    return OvhApiTelephony.Service().v6().get({
      billingAccount: $stateParams.billingAccount,
      serviceName: agent.number,
    }).$promise.then(service => service.description);
  };

  self.reorderAgentsOfQueue = function (queue, agents) {
    const ids = _.pluck(agents, 'agentId');
    OvhApiTelephony.OvhPabx().Hunting().Queue().Agent()
      .v6()
      .resetAllCache();
    return $q
      .all(_.map(
        _.chunk(ids, 50),
        chunkIds => OvhApiTelephony.OvhPabx().Hunting().Queue().Agent()
          .v6()
          .getBatch({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            queueId: queue.queueId,
            agentId: chunkIds,
          }).$promise,
      ))
      .then(chunkResult => _.pluck(_.flatten(chunkResult), 'value')).then((orders) => {
        _.each(orders, (order) => {
          const agent = _.find(agents, { agentId: order.agentId });
          if (agent) {
            agent.position = order.position;
          }
        });
        return _.sortBy(agents, 'position');
      });
  };

  self.swapAgentsOfQueue = function (queue, fromAgent, toAgent) {
    return OvhApiTelephony.OvhPabx().Hunting().Queue().Agent()
      .v6()
      .change({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId: queue.queueId,
        agentId: fromAgent.agentId,
      }, {
        position: toAgent.position,
      }).$promise;
  };

  self.updateAgent = function (agent) {
    const attrs = ['status', 'timeout', 'wrapUpTime', 'simultaneousLines'];
    return OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
      .change({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        agentId: agent.agentId,
      }, _.pick(agent, attrs)).$promise;
  };

  self.deleteAgentFromQueue = function (queue, toDelete) {
    return OvhApiTelephony.OvhPabx().Hunting().Queue().Agent()
      .v6()
      .remove({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId: queue.queueId,
        agentId: toDelete.agentId,
      }).$promise;
  };

  self.createQueue = function () {
    self.isCreating = true;
    return OvhApiTelephony.OvhPabx().Hunting().Queue().v6()
      .create({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }, {
        strategy: 'sequentiallyByAgentOrder',
      }).$promise.then(() => {
        TucToast.success($translate.instant('telephony_alias_configuration_queues_queue_create_success'));
        return self.fetchQueues().then((queues) => {
          self.queues = queues;
        });
      }).catch(err => new TucToastError(err)).finally(() => {
        self.isCreating = false;
      });
  };

  self.deleteQueue = function (queue) {
    self.isDeleting = true;
    return OvhApiTelephony.OvhPabx().Hunting().Queue().v6()
      .remove({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId: queue.queueId,
      }).$promise.then(() => {
        _.remove(self.queues, { queueId: queue.queueId });
        TucToast.success($translate.instant('telephony_alias_configuration_queues_queue_delete_success'));
      }).catch(err => new TucToastError(err)).finally(() => {
        self.isDeleting = false;
      });
  };

  self.getAgentsQueueToAdd = function (queue) {
    const queueAgents = queue.agentsApi.getMemberList();
    return _.filter(self.agents, agent => !_.find(queueAgents, { agentId: agent.agentId }));
  };

  self.addAgentToQueue = function (queue) {
    const modal = $uibModal.open({
      animation: true,
      templateUrl: 'app/telecom/telephony/alias/configuration/queues/ovhPabx/telecom-telephony-alias-configuration-queues-ovhPabx-modal.html',
      controller: 'telecomTelephonyAliasConfigurationQueuesOvhPabxCtrlModal',
      controllerAs: '$ctrl',
    });
    modal.result.then(() => {
      _.set(queue, 'isAdding', true);
      return OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
        .addToQueue({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          agentId: queue.agentToAdd,
        }, {
          queueId: queue.queueId,
          position: 0,
        }).$promise.then(() => {
          const added = _.find(self.agents, { agentId: queue.agentToAdd });
          queue.agentsApi.addMembersToList([added]);
          _.set(queue, 'agentToAdd', null);
          _.set(queue, 'addAgent', false);
          TucToast.success($translate.instant('telephony_alias_configuration_queues_agent_add_success'));
        }).catch(err => new TucToastError(err)).finally(() => {
          _.set(queue, 'isAdding', false);
        });
    });
  };

  self.startQueueEdition = function (queue) {
    _.set(queue, 'inEdition', _.pick(queue, [
      'description',
      'strategy',
      'followCallForwards',
      'maxMember',
      'maxWaitTime',
      'soundOnHold',
      'actionOnOverflowParam',
    ]));
  };

  self.hasQueueInEditionChanges = function (queue) {
    const attrs = [
      'description',
      'strategy',
      'followCallForwards',
      'maxMember',
      'maxWaitTime',
      'soundOnHold',
      'actionOnOverflowParam',
    ];
    return !angular.equals(_.pick(queue, attrs), _.pick(queue.inEdition, attrs));
  };

  self.updateQueue = function (queue) {
    _.set(queue, 'isUpdating', true);
    return OvhApiTelephony.OvhPabx().Hunting().Queue().v6()
      .change({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId: queue.queueId,
      }, {
        description: queue.inEdition.description,
        strategy: queue.inEdition.strategy,
        followCallForwards: queue.inEdition.followCallForwards,
        maxMember: queue.inEdition.maxMember,
        maxWaitTime: queue.inEdition.maxWaitTime,
        soundOnHold: queue.inEdition.soundOnHold || null,
        actionOnOverflow: queue.inEdition.actionOnOverflowParam ? 'playback' : null,
        actionOnOverflowParam: queue.inEdition.actionOnOverflowParam || null,
      }).$promise.then(() => {
        _.assign(queue, queue.inEdition);
        _.set(queue, 'inEdition', null);
        TucToast.success($translate.instant('telephony_alias_configuration_queues_queue_update_success'));
      }).catch(err => new TucToastError(err)).finally(() => {
        _.set(queue, 'isUpdating', true);
      });
  };

  self.openManageSoundsHelper = function (queue, toneType) {
    self.managingSounds = true;
    const modal = $uibModal.open({
      animation: true,
      templateUrl: 'components/telecom/alias/hunting/sounds/telecom-telephony-alias-hunting-sounds.html',
      controller: 'TelecomTelephonyAliasHuntingSoundsCtrl',
      controllerAs: '$ctrl',
      resolve: {
        params() {
          return {
            sounds: self.sounds,
            apiEndpoint: OvhApiTelephony.OvhPabx(),
            refreshSounds() {
              return self.fetchSounds().then((sounds) => {
                // we mutate sounds array because it is used in the modal aswell
                self.sounds.length = 0;
                Array.prototype.push.apply(self.sounds, sounds);
              }).catch(err => new TucToastError(err));
            },
          };
        },
      },
    });
    modal.result.then((sound) => {
      if (sound) {
        queue.inEdition[toneType] = sound.soundId; // eslint-disable-line
      }
    }).finally(() => {
      self.managingSounds = false;
    });
    return modal;
  };

  self.filterDescription = function (valueParam) {
    let value = valueParam;
    if (value) {
      // limits description characters range
      value = value.replace(/[^àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœa-zA-Z0-9_-\s]/g, '');

      // limits description length
      value = value.slice(0, 100);
    }
    return value;
  };

  init();
});
