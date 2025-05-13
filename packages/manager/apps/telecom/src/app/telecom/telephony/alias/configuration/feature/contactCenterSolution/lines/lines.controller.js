import assign from 'lodash/assign';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';

import deleteController from './delete/delete.controller';
import deleteTemplate from './delete/delete.html';
import editController from './edit/edit.controller';
import editTemplate from './edit/edit.html';

import { LINES } from '../contact-center-solution.constants';

export default class TelecomTelephonyAliasConfigurationLinesCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    $uibModal,
    featureTypeLabel,
    OvhApiTelephony,
    TucToast,
    tucVoipServiceAlias,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.featureTypeLabel = featureTypeLabel;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
  }

  $onInit() {
    this.enums = [];
    this.queue = null;
    this.agents = [];
    this.copyAgents = [];

    this.serviceInfos = {
      billingAccount: this.$stateParams.billingAccount,
      serviceName: this.$stateParams.serviceName,
    };
    this.selectedCaller = null;
    this.selectedStrategy = null;
    this.updatingAgents = false;

    this.loading = true;
    return this.$q
      .all({
        ccs: this.tucVoipServiceAlias.fetchContactCenterSolutionNumber(
          this.serviceInfos,
        ),
        queues: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberQueues(
          this.serviceInfos,
        ),
        enums: this.fetchEnums(),
      })
      .then(({ ccs, enums, queues }) => {
        this.contactCenterSolution = angular.copy(ccs);
        this.copyContactCenterSolution = angular.copy(ccs);

        [this.queue] = queues;
        this.copyQueue = angular.copy(this.queue);
        this.enums = enums;

        this.selectedCaller = find(this.enums.caller, {
          value: this.contactCenterSolution.showCallerNumber,
        });
        this.selectedStrategy = find(this.enums.strategy, {
          value: this.contactCenterSolution.strategy,
        });

        return this.tucVoipServiceAlias.fetchContactCenterSolutionNumberAgentsInQueue(
          this.serviceInfos,
          this.queue.queueId,
        );
      })
      .then((agents) => this.handleAgentsPromiseResult(agents))
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_lines_get_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  fetchEnums() {
    return this.OvhApiTelephony.v6()
      .schema()
      .$promise.then(({ models }) => ({
        caller: get(models, 'telephony.OvhPabxDialplanNumberPresentationEnum', {
          enum: [],
        })
          .enum.map((caller) => ({
            label: this.$translate.instant(
              `telephony_alias_config_contactCenterSolution_lines_display_number_${caller}`,
            ),
            value: caller,
          }))
          .reverse(),
        strategy: LINES.strategies
          .filter((strategy) =>
            get(models, 'telephony.OvhPabxHuntingQueueStrategyEnum', {
              enum: [],
            }).enum.includes(strategy),
          )
          .map((strategy) => ({
            label: this.$translate.instant(
              `telephony_alias_config_contactCenterSolution_lines_strategy_${strategy}`,
            ),
            value: strategy,
          })),
        status: get(models, 'telephony.OvhPabxHuntingAgentStatusEnum', {
          enum: [],
        }).enum.map((status) => ({
          label: this.$translate.instant(
            `telephony_alias_config_contactCenterSolution_lines_status_${status}`,
          ),
          value: status,
        })),
      }));
  }

  moveLineOrder(row, direction) {
    const rowPosition = angular.copy(row.position);
    const newRowPosition =
      direction === 'up' ? rowPosition - 1 : rowPosition + 1;
    const tmpRow = this.agents[newRowPosition];

    this.agents[rowPosition] = Object.assign(tmpRow, {
      position: rowPosition,
    });
    this.agents[newRowPosition] = Object.assign(row, {
      position: newRowPosition,
    });
    this.agents = TelecomTelephonyAliasConfigurationLinesCtrl.formatAgents(
      this.agents,
    );
  }

  hasChanged() {
    return (
      this.canUpdateContactCenterSolution() ||
      this.canUpdateAgentsList() ||
      this.canUpdateQueue()
    );
  }

  canUpdateContactCenterSolution() {
    return !isEqual(this.contactCenterSolution, this.copyContactCenterSolution);
  }

  canUpdateAgentsList() {
    return !isEqual(this.agents, this.copyAgents);
  }

  canUpdateQueue() {
    return !isEqual(this.queue, this.copyQueue);
  }

  deleteLineOpenModal(line) {
    this.$uibModal
      .open({
        template: deleteTemplate,
        controller: deleteController,
        controllerAs: '$ctrl',
        resolve: {
          line,
        },
      })
      .result.then(() => this.deleteLine(line.agentId));
  }

  deleteLine(agentId) {
    this.updatingAgents = true;
    return this.tucVoipServiceAlias
      .deleteContactCenterSolutionNumberAgent(this.serviceInfos, agentId)
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_lines_delete_line_success',
          ),
        );
        return this.tucVoipServiceAlias.fetchContactCenterSolutionNumberAgentsInQueue(
          this.serviceInfos,
          this.queue.queueId,
        );
      })
      .then((agents) => this.handleAgentsPromiseResult(agents))
      .catch((error) => {
        this.TucToast(
          `${this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_lines_delete_line_error',
          )} ${get(error, 'data.message', '')}`,
        );
      })
      .finally(() => {
        this.updatingAgents = false;
      });
  }

  updateLine(lineToEdit) {
    const updateLineModel = this.$uibModal.open({
      template: editTemplate,
      controller: editController,
      controllerAs: '$ctrl',
      resolve: {
        lineToEdit: () => angular.copy(lineToEdit),
        enumStatus: () => this.enums.status,
      },
    });

    updateLineModel.result
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_lines_line_edit_success',
          ),
        );

        return this.tucVoipServiceAlias.fetchContactCenterSolutionNumberAgentsInQueue(
          this.serviceInfos,
          this.queue.queueId,
        );
      })
      .then(() =>
        this.tucVoipServiceAlias.fetchContactCenterSolutionNumberAgentsInQueue(
          this.serviceInfos,
          this.queue.queueId,
        ),
      )
      .then((agents) => this.handleAgentsPromiseResult(agents))
      .catch((error) => {
        if (isObject(error)) {
          this.TucToast.error(error);
        }
      });
  }

  updateAgentsList() {
    let promiseChain = this.$q.when();

    this.agents.forEach((agent) => {
      promiseChain = promiseChain.then(() =>
        this.tucVoipServiceAlias.updateContactCenterSolutionAgentPositionInQueue(
          this.serviceInfos,
          agent,
          this.queue.queueId,
        ),
      );
    });

    return promiseChain;
  }

  updateContactCenterSolution() {
    this.loading = true;

    return this.$q
      .all({
        ccs: this.canUpdateContactCenterSolution()
          ? this.tucVoipServiceAlias.updateContactCenterSolutionNumber(
              this.serviceInfos,
              this.contactCenterSolution,
            )
          : angular.noop(),
        agentsList: this.canUpdateAgentsList()
          ? this.updateAgentsList()
          : angular.noop(),
        queue: this.canUpdateQueue()
          ? this.tucVoipServiceAlias.updateContactCenterSolutionNumberQueue(
              this.serviceInfos,
              this.queue,
            )
          : angular.noop(),
      })
      .then(() => {
        this.OvhApiTelephony.EasyHunting()
          .Hunting()
          .v6()
          .resetCache();
        this.OvhApiTelephony.EasyHunting()
          .Hunting()
          .Queue()
          .v6()
          .resetCache();
        this.OvhApiTelephony.EasyHunting()
          .Hunting()
          .Queue()
          .Agent()
          .v6()
          .resetAllCache();
        return this.$state.go('^').then(() => {
          this.TucToast.success(
            this.$translate.instant(
              'telephony_alias_config_contactCenterSolution_lines_update_success',
            ),
          );
        });
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_lines_update_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  handleAgentsPromiseResult(agents) {
    this.agents = TelecomTelephonyAliasConfigurationLinesCtrl.formatAgents(
      agents,
    );
    this.copyAgents = angular.copy(this.agents);
    return agents;
  }

  static formatAgents(agents) {
    return agents.map((agent) =>
      assign(agent, {
        position: agent.position,
        $first: agent.position === 0,
        $last: agent.position === agents.length - 1,
      }),
    );
  }
}
