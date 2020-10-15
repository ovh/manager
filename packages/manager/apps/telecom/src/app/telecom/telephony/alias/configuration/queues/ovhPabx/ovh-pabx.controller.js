import assign from 'lodash/assign';
import chunk from 'lodash/chunk';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import pick from 'lodash/pick';
import remove from 'lodash/remove';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';

import { NUMBER_EXTERNAL_TYPE } from './ovh-pabx.constants';

import modalController from './modal/modal.controller';
import modalTemplate from './modal/modal.html';

import huntingSoundsController from './hunting-sounds/huntings-sounds.controller';
import huntingSoundsTemplate from './hunting-sounds/huntings-sounds.html';

export default /* @ngInject */ function TelecomTelephonyAliasConfigurationQueuesOvhPabxCtrl(
  $stateParams,
  $q,
  $translate,
  $timeout,
  $uibModal,
  OvhApiTelephony,
  TucToast,
  TucToastError,
) {
  const self = this;

  function init() {
    self.queues = null;
    return $q
      .all({
        queues: self.fetchQueues(),
        agents: self.fetchAgents(),
        sounds: self.fetchSounds(),
        enums: self.fetchEnums(),
      })
      .then((result) => {
        self.enums = result.enums;
        self.queues = result.queues;
        self.agents = result.agents;
        self.sounds = result.sounds;
        if (self.queues.length) {
          head(self.queues).isOpen = true;
        }
      })
      .catch((err) => new TucToastError(err));
  }

  self.fetchEnums = function fetchEnums() {
    return OvhApiTelephony.v6()
      .schema()
      .$promise.then((result) => ({
        strategy: get(result, [
          'models',
          'telephony.OvhPabxHuntingQueueStrategyEnum',
          'enum',
        ]),
      }));
  };

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
                return self.bindQueueAgentsApi(queue);
              }),
          ),
        ),
      );
  };

  self.bindQueueAgentsApi = function bindQueueAgentsApi(queue) {
    set(queue, 'agentsApi', {
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

  self.fetchSounds = function fetchSounds() {
    return OvhApiTelephony.OvhPabx()
      .Sound()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((ids) =>
        $q.all(
          map(
            ids,
            (id) =>
              OvhApiTelephony.OvhPabx()
                .Sound()
                .v6()
                .get({
                  billingAccount: $stateParams.billingAccount,
                  serviceName: $stateParams.serviceName,
                  soundId: id,
                }).$promise,
          ),
        ),
      );
  };

  self.findSoundById = function findSoundById(soundId) {
    return find(self.sounds, { soundId: parseInt(`${soundId}`, 10) });
  };

  self.fetchAgents = function fetchAgents() {
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Agent()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                OvhApiTelephony.OvhPabx()
                  .Hunting()
                  .Agent()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                    agentId: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => map(flatten(chunkResult), 'value')),
      );
  };

  self.fetchAgentsOfQueue = function fetchAgentsOfQueue(queue) {
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .Agent()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId: queue.queueId,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                OvhApiTelephony.OvhPabx()
                  .Hunting()
                  .Agent()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                    agentId: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => map(flatten(chunkResult), 'value')),
      );
  };

  self.fetchAgentDescription = function fetchAgentDescription(agent) {
    return OvhApiTelephony.Service()
      .v6()
      .get({
        billingAccount: $stateParams.billingAccount,
        serviceName: agent.number,
      })
      .$promise.then((service) => service.description);
  };

  self.reorderAgentsOfQueue = function reorderAgentsOfQueue(queue, agents) {
    const ids = map(agents, 'agentId');
    OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .Agent()
      .v6()
      .resetAllCache();
    return $q
      .all(
        map(
          chunk(ids, 50),
          (chunkIds) =>
            OvhApiTelephony.OvhPabx()
              .Hunting()
              .Queue()
              .Agent()
              .v6()
              .getBatch({
                billingAccount: $stateParams.billingAccount,
                serviceName: $stateParams.serviceName,
                queueId: queue.queueId,
                agentId: chunkIds,
              }).$promise,
        ),
      )
      .then((chunkResult) => map(flatten(chunkResult), 'value'))
      .then((orders) => {
        forEach(orders, (order) => {
          const agent = find(agents, { agentId: order.agentId });
          if (agent) {
            agent.position = order.position;
          }
        });
        return sortBy(agents, 'position');
      });
  };

  self.swapAgentsOfQueue = function swapAgentsOfQueue(
    queue,
    fromAgent,
    toAgent,
  ) {
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .Agent()
      .v6()
      .change(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          queueId: queue.queueId,
          agentId: fromAgent.agentId,
        },
        {
          position: toAgent.position,
        },
      ).$promise;
  };

  self.updateAgent = function updateAgent(agent) {
    const attrs = ['status', 'timeout', 'wrapUpTime', 'simultaneousLines'];
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Agent()
      .v6()
      .change(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          agentId: agent.agentId,
        },
        pick(agent, attrs),
      ).$promise;
  };

  self.deleteAgentFromQueue = function deleteAgentFromQueue(queue, toDelete) {
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .Agent()
      .v6()
      .remove({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId: queue.queueId,
        agentId: toDelete.agentId,
      }).$promise;
  };

  self.createQueue = function createQueue() {
    self.isCreating = true;
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .v6()
      .create(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {
          strategy: 'sequentiallyByAgentOrder',
        },
      )
      .$promise.then(() => {
        TucToast.success(
          $translate.instant(
            'telephony_alias_configuration_queues_queue_create_success',
          ),
        );
        return self.fetchQueues().then((queues) => {
          self.queues = queues;
        });
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isCreating = false;
      });
  };

  self.deleteQueue = function deleteQueue(queue) {
    self.isDeleting = true;
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .v6()
      .remove({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId: queue.queueId,
      })
      .$promise.then(() => {
        remove(self.queues, { queueId: queue.queueId });
        TucToast.success(
          $translate.instant(
            'telephony_alias_configuration_queues_queue_delete_success',
          ),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isDeleting = false;
      });
  };

  self.getAgentsQueueToAdd = function getAgentsQueueToAdd(queue) {
    const queueAgents = queue.agentsApi.getMemberList();
    return filter(
      self.agents,
      (agent) => !find(queueAgents, { agentId: agent.agentId }),
    );
  };

  self.addAgentToQueue = function addAgentToQueue(queue) {
    let confirm = $q.when();
    if (queue.agentToAdd.type === NUMBER_EXTERNAL_TYPE) {
      confirm = $uibModal.open({
        animation: true,
        template: modalTemplate,
        controller: modalController,
        controllerAs: '$ctrl',
      }).result;
    }

    confirm.then(() => {
      set(queue, 'isAdding', true);
      return OvhApiTelephony.OvhPabx()
        .Hunting()
        .Agent()
        .v6()
        .addToQueue(
          {
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            agentId: queue.agentToAdd.agentId,
          },
          {
            queueId: queue.queueId,
            position: 0,
          },
        )
        .$promise.then(() => {
          const added = find(self.agents, {
            agentId: queue.agentToAdd.agentId,
          });
          queue.agentsApi.addMembersToList([added]);
          set(queue, 'agentToAdd', null);
          set(queue, 'addAgent', false);
          TucToast.success(
            $translate.instant(
              'telephony_alias_configuration_queues_agent_add_success',
            ),
          );
        })
        .catch((err) => new TucToastError(err))
        .finally(() => {
          set(queue, 'isAdding', false);
        });
    });
  };

  self.startQueueEdition = function startQueueEdition(queue) {
    set(
      queue,
      'inEdition',
      pick(queue, [
        'description',
        'strategy',
        'followCallForwards',
        'maxMember',
        'maxWaitTime',
        'soundOnHold',
        'actionOnOverflowParam',
      ]),
    );
  };

  self.hasQueueInEditionChanges = function hasQueueInEditionChanges(queue) {
    const attrs = [
      'description',
      'strategy',
      'followCallForwards',
      'maxMember',
      'maxWaitTime',
      'soundOnHold',
      'actionOnOverflowParam',
    ];
    return !angular.equals(pick(queue, attrs), pick(queue.inEdition, attrs));
  };

  self.updateQueue = function updateQueue(queue) {
    set(queue, 'isUpdating', true);
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .v6()
      .change(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          queueId: queue.queueId,
        },
        {
          description: queue.inEdition.description,
          strategy: queue.inEdition.strategy,
          followCallForwards: queue.inEdition.followCallForwards,
          maxMember: queue.inEdition.maxMember,
          maxWaitTime: queue.inEdition.maxWaitTime,
          soundOnHold: queue.inEdition.soundOnHold || null,
          actionOnOverflow: queue.inEdition.actionOnOverflowParam
            ? 'playback'
            : null,
          actionOnOverflowParam: queue.inEdition.actionOnOverflowParam || null,
        },
      )
      .$promise.then(() => {
        assign(queue, queue.inEdition);
        set(queue, 'inEdition', null);
        TucToast.success(
          $translate.instant(
            'telephony_alias_configuration_queues_queue_update_success',
          ),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        set(queue, 'isUpdating', true);
      });
  };

  self.openManageSoundsHelper = function openManageSoundsHelper(
    queue,
    toneType,
  ) {
    self.managingSounds = true;
    const modal = $uibModal.open({
      animation: true,
      template: huntingSoundsTemplate,
      controller: huntingSoundsController,
      controllerAs: '$ctrl',
      resolve: {
        params() {
          return {
            sounds: self.sounds,
            apiEndpoint: OvhApiTelephony.OvhPabx(),
            refreshSounds() {
              return self
                .fetchSounds()
                .then((sounds) => {
                  // we mutate sounds array because it is used in the modal aswell
                  self.sounds.length = 0;
                  Array.prototype.push.apply(self.sounds, sounds);
                })
                .catch((err) => new TucToastError(err));
            },
          };
        },
      },
    });
    modal.result
      .then((sound) => {
        if (sound) {
          // eslint-disable-next-line no-param-reassign
          queue.inEdition[toneType] = sound.soundId;
        }
      })
      .finally(() => {
        self.managingSounds = false;
      });
    return modal;
  };

  self.filterDescription = function filterDescription(valueParam) {
    let value = valueParam;
    if (value) {
      // limits description characters range
      value = value.replace(
        /[^àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœa-zA-Z0-9_-\s]/g,
        '',
      );

      // limits description length
      value = value.slice(0, 100);
    }
    return value;
  };

  init();
}
