angular.module('managerApp').controller('TelecomTelephonyAliasConfigurationAgentsOvhPabxCtrl', class TelecomTelephonyAliasConfigurationAgentsOvhPabxCtrl {
  constructor($q, $stateParams, $timeout, $translate, $uibModal, OvhApiTelephony, TucToast) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
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
      { value: 'internal', label: this.$translate.instant('telephony_alias_configuration_agents_type_internal') },
      { value: 'external', label: this.$translate.instant('telephony_alias_configuration_agents_type_external') },
    ];

    this.onChooseServicePopover = ({ serviceName }, pos) => {
      this.addAgentForm.numbers[pos] = serviceName;
    };

    return this.fetchAgentsIds().then((ids) => {
      this.agents.ids = ids;
    }).catch((err) => {
      this.TucToast.error([this.$translate.instant('telephony_alias_configuration_agents_get_error'), _.get(err, 'data.message')].join(' '));
      return this.$q.reject(err);
    });
  }

  orderBy(prop, asc) {
    this.orderedAscAgents = !this.orderedAscAgents;
    if (asc != null) {
      this.orderedAscAgents = asc;
    }

    this.agents.paginated = _.sortBy(this.agents.paginated, prop);

    if (!this.orderedAscAgents) {
      this.agents.paginated = this.agents.paginated.reverse();
    }
  }

  fetchAgentsIds() {
    this.agents.isLoading = true;
    return this.OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
      .query({
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
      }).$promise.finally(() => {
        this.agents.isLoading = false;
      });
  }

  fetchAgent(id) {
    return this.OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
      .get({
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
        agentId: id,
      }).$promise;
  }

  getSelectedAgentIds() {
    return _.keys(this.agents.selected);
  }

  onTransformItemDone(items) {
    this.$timeout(() => this.orderBy('number', this.orderedAscAgents));
    return items;
  }

  deleteAgents() {
    this.agents.isDeleting = true;
    return this.$q
      .all(this.getSelectedAgentIds()
        .map(id => this.OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
          .remove({
            billingAccount: this.$stateParams.billingAccount,
            serviceName: this.$stateParams.serviceName,
            agentId: id,
          }).$promise.then(() => {
            _.pull(this.agents.id, parseInt(id, 10));
          })))
      .then(() => {
        this.TucToast.success(this.$translate.instant('telephony_alias_configuration_agents_delete_success'));
        return this.fetchAgentsIds().then((ids) => {
          this.agents.ids = ids;
        });
      })
      .catch((err) => {
        this.TucToast.error([this.$translate.instant('telephony_alias_configuration_agents_delete_error'), _.get(err, 'data.message')].join(' '));
        return this.$q.reject(err);
      })
      .finally(() => {
        this.agents.isDeleting = false;
        this.agents.selected = {};
      });
  }

  static startEdition(agent) {
    _.set(agent, 'inEdition', _.pick(agent, ['description', 'number', 'simultaneousLines', 'status', 'timeout', 'type', 'wrapUpTime']));
  }

  static isValidAgent({
    number, timeout, simultaneousLines, wrapUpTime,
  }) {
    let valid = true;
    valid = valid && number;
    valid = valid && /^\d{1,6}$/.test(timeout);
    valid = valid && /^\d{1,6}$/.test(wrapUpTime);
    valid = valid && /^([1-9]|10)$/.test(simultaneousLines);
    return valid;
  }

  updateAgent(agent) {
    _.set(agent, 'isUpdating', true);
    return this.OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
      .change({
        billingAccount: this.$stateParams.billingAccount,
        serviceName: this.$stateParams.serviceName,
        agentId: agent.agentId,
      }, agent.inEdition).$promise
      .then(() => {
        _.assign(agent, agent.inEdition);
        _.set(agent, 'inEdition', null);
        this.TucToast.success(this.$translate.instant('telephony_alias_configuration_agents_update_success'));
      })
      .catch((err) => {
        this.TucToast.error([this.$translate.instant('telephony_alias_configuration_agents_update_error'), _.get(err, 'data.message')].join(' '));
        return this.$q.reject(err);
      })
      .finally(() => {
        _.set(agent, 'isUpdating', false);
      });
  }

  cancelAddAgent(pos) {
    if (pos === 0 && this.addAgentForm.numbers.length > 1) {
      this.addAgentForm.numbers.shift();
    } else if (this.addAgentForm.numbers.length > 1) {
      _.pullAt(this.addAgentForm.numbers, pos);
    } else {
      this.addAgentForm.numbers[0] = null;
    }
  }

  addAgents() {
    const modal = this.$uibModal.open({
      animation: true,
      templateUrl: 'app/telecom/telephony/alias/configuration/agents/ovhPabx/telecom-telephony-alias-configuration-agents-ovhPabx-modal.html',
      controller: 'telecomTelephonyAliasConfigurationAgentsOvhPabxModal',
      controllerAs: '$ctrl',
    });
    modal.result.then(() => {
      this.addAgentForm.isAdding = true;
      return this.$q.all(this.addAgentForm.numbers.map((number) => {
        if (!number || !number.length) {
          return this.$q.when(null);
        }
        return this.OvhApiTelephony.OvhPabx().Hunting().Agent().v6()
          .create({
            billingAccount: this.$stateParams.billingAccount,
            serviceName: this.$stateParams.serviceName,
          }, {
            number,
            simultaneousLines: 1,
            status: 'available',
            timeout: 20,
            wrapUpTime: 0,
          }).$promise;
      }))
        .then(() => {
          this.TucToast.success(this.$translate.instant('telephony_alias_configuration_agents_add_success'));
          return this.fetchAgentsIds().then((ids) => {
            this.agents.ids = ids;
          });
        })
        .catch((err) => {
          this.TucToast.error([this.$translate.instant('telephony_alias_configuration_agents_add_error'), _.get(err, 'data.message')].join(' '));
          return this.$q.reject(err);
        })
        .finally(() => {
          this.addAgentForm.isAdding = false;
          this.addAgentForm.numbers = [null];
        });
    });
  }
});
