import assign from 'lodash/assign';
import endsWith from 'lodash/endsWith';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';
import pick from 'lodash/pick';
import pull from 'lodash/pull';
import pullAt from 'lodash/pullAt';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';

import modalTemplate from './modal/modal.html';
import modalController from './modal/modal.controller';

import { ALLOWED_FEATURE_TYPES, NUMBER_PREFIXES } from './ovh-pabx.constants';

export default class TelecomTelephonyAliasConfigurationAgentsOvhPabxCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $timeout,
    $translate,
    $uibModal,
    OvhApiTelephony,
    TelephonyMediator,
    tucTelecomVoip,
    TucToast,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
    this.TelephonyMediator = TelephonyMediator;
    this.tucTelecomVoip = tucTelecomVoip;
  }

  $onInit() {
    this.orderedAscAgents = true;
    this.agents = {
      ids: [],
      paginated: [],
      selected: {},
      isLoading: false,
    };

    this.addAgentForm = {
      numbers: [null],
      isAdding: false,
    };

    this.types = [
      {
        value: 'internal',
        label: this.$translate.instant(
          'telephony_alias_configuration_agents_type_internal',
        ),
      },
      {
        value: 'external',
        label: this.$translate.instant(
          'telephony_alias_configuration_agents_type_external',
        ),
      },
    ];

    this.onChooseServicePopover = ({ serviceName }, pos) => {
      this.addAgentForm.numbers[pos] = serviceName;
    };

    this.$q
      .all({
        translations: this.$translate.refresh(),
        services: this.tucTelecomVoip.fetchAll(),
      })
      .then((result) => {
        this.groupList = result.services;
        return this.fetchAgentsIds();
      })
      .then((ids) => {
        this.agents.ids = ids;
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_configuration_agents_get_error',
          )} ${get(err, 'data.message')}`,
        );
        return this.$q.reject(err);
      });
  }

  orderBy(prop, asc) {
    this.orderedAscAgents = !this.orderedAscAgents;
    if (asc != null) {
      this.orderedAscAgents = asc;
    }

    this.agents.paginated = sortBy(this.agents.paginated, prop);

    if (!this.orderedAscAgents) {
      this.agents.paginated = this.agents.paginated.reverse();
    }
  }

  fetchAgentsIds() {
    this.agents.isLoading = true;
    return this.OvhApiTelephony.OvhPabx()
      .Hunting()
      .Agent()
      .v6()
      .query({
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
      })
      .$promise.finally(() => {
        this.agents.isLoading = false;
      });
  }

  fetchAgent(id) {
    return this.OvhApiTelephony.OvhPabx()
      .Hunting()
      .Agent()
      .v6()
      .get({
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
        agentId: id,
      }).$promise;
  }

  getSelectedAgentIds() {
    return keys(this.agents.selected);
  }

  onTransformItemDone(items) {
    this.$timeout(() => this.orderBy('number', this.orderedAscAgents));
    return items;
  }

  deleteAgents() {
    this.agents.isDeleting = true;
    return this.$q
      .all(
        this.getSelectedAgentIds().map((id) =>
          this.OvhApiTelephony.OvhPabx()
            .Hunting()
            .Agent()
            .v6()
            .remove({
              billingAccount: this.$stateParams.billingAccount,
              serviceName: this.$stateParams.serviceName,
              agentId: id,
            })
            .$promise.then(() => {
              pull(this.agents.id, parseInt(id, 10));
            }),
        ),
      )
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'telephony_alias_configuration_agents_delete_success',
          ),
        );
        return this.fetchAgentsIds();
      })
      .then((ids) => {
        this.agents.ids = ids;
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_configuration_agents_delete_error',
          )} ${get(err, 'data.message')}`,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.agents.isDeleting = false;
        this.agents.selected = {};
      });
  }

  static startEdition(agent) {
    set(
      agent,
      'inEdition',
      pick(agent, [
        'description',
        'number',
        'simultaneousLines',
        'status',
        'timeout',
        'type',
        'wrapUpTime',
      ]),
    );
  }

  static isValidAgent({ number, timeout, simultaneousLines, wrapUpTime }) {
    let valid = true;
    valid = valid && number;
    valid = valid && /^\d{1,6}$/.test(timeout);
    valid = valid && /^\d{1,6}$/.test(wrapUpTime);
    valid = valid && /^([1-9]|10)$/.test(simultaneousLines);
    return valid;
  }

  updateAgent(agent) {
    set(agent, 'isUpdating', true);
    return this.OvhApiTelephony.OvhPabx()
      .Hunting()
      .Agent()
      .v6()
      .change(
        {
          billingAccount: this.$stateParams.billingAccount,
          serviceName: this.$stateParams.serviceName,
          agentId: agent.agentId,
        },
        agent.inEdition,
      )
      .$promise.then(() => {
        assign(agent, agent.inEdition);
        set(agent, 'inEdition', null);
        this.TucToast.success(
          this.$translate.instant(
            'telephony_alias_configuration_agents_update_success',
          ),
        );
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_configuration_agents_update_error',
          )} ${get(err, 'data.message')}`,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        set(agent, 'isUpdating', false);
      });
  }

  cancelAddAgent(pos) {
    if (pos === 0 && this.addAgentForm.numbers.length > 1) {
      this.addAgentForm.numbers.shift();
    } else if (this.addAgentForm.numbers.length > 1) {
      pullAt(this.addAgentForm.numbers, pos);
    } else {
      this.addAgentForm.numbers[0] = null;
    }
  }

  getInternalNumber(newNumber) {
    const allNumbers = flatten(map(this.groupList, 'services'));
    const [, numberSuffix] = newNumber.replace(/ /g, '').split(NUMBER_PREFIXES);
    return allNumbers.find(({ serviceName }) =>
      endsWith(serviceName, numberSuffix),
    );
  }

  // Check if external numbers are defined into the list
  checkExternalNumber() {
    return !this.addAgentForm.numbers.some((newNumber) => {
      const internalNumber = this.getInternalNumber(newNumber);
      return (
        internalNumber !== undefined &&
        ALLOWED_FEATURE_TYPES.includes(internalNumber.serviceType)
      );
    });
  }

  addAgents() {
    if (this.checkExternalNumber()) {
      this.$uibModal
        .open({
          animation: true,
          template: modalTemplate,
          controller: modalController,
          controllerAs: '$ctrl',
        })
        .result.then(() => {
          this.createAgents();
        });
    } else {
      this.createAgents();
    }
  }

  createAgents() {
    this.addAgentForm.isAdding = true;
    return this.$q
      .all(
        this.addAgentForm.numbers.map((number) => {
          if (!number || !number.length) {
            return this.$q.when(null);
          }
          return this.OvhApiTelephony.OvhPabx()
            .Hunting()
            .Agent()
            .v6()
            .create(
              {
                billingAccount: this.$stateParams.billingAccount,
                serviceName: this.$stateParams.serviceName,
              },
              {
                number,
                simultaneousLines: 1,
                status: 'available',
                timeout: 20,
                wrapUpTime: 0,
              },
            ).$promise;
        }),
      )
      .then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'telephony_alias_configuration_agents_add_success',
          ),
        );
        return this.fetchAgentsIds();
      })
      .then((ids) => {
        this.agents.ids = ids;
      })
      .catch((err) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_configuration_agents_add_error',
          )} ${get(err, 'data.message')}`,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.addAgentForm.isAdding = false;
        this.addAgentForm.numbers = [null];
      });
  }
}
