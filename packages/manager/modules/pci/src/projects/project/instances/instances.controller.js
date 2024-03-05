import isEmpty from 'lodash/isEmpty';

import {
  INSTANCE_HELP_REFERENCE_KEY,
  OPENSTACK_INSTANCE_STATUS,
} from './instances.constants';
import { getCriteria } from '../project.utils';

export default class CloudProjectComputeInfrastructureListCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    coreConfig,
    CucCloudMessage,
    ovhManagerRegionService,
    ovhUserPref,
    PciProjectsProjectInstanceService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.ovhUserPref = ovhUserPref;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.hasVrack = !isEmpty(this.vrack);
    this.loadMessages();
    this.checkHelpDisplay();

    this.criteria = getCriteria('id', this.instanceId);
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.instances',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  loadInstanceDetail(instance) {
    return this.PciProjectsProjectInstanceService.getInstanceDetails(
      this.projectId,
      instance,
    );
  }

  checkHelpDisplay() {
    return new Promise((resolve) => {
      if (this.help) {
        return this.ovhUserPref
          .getValue(this.getHelpPreferenceKey())
          .then((value) => {
            this.displayHelp = value && this.help;
          })
          .catch(() => {
            this.displayHelp = this.help;
          })
          .finally(() => resolve());
      }
      return resolve();
    });
  }

  static displayMonthlyBillingUpgradeOption(instance) {
    return (
      instance.status === 'ACTIVE' &&
      !instance.isMonthlyBillingActivated() &&
      instance.flavor.planCodes.monthly
    );
  }

  getHelpPreferenceKey() {
    return `${INSTANCE_HELP_REFERENCE_KEY}${this.help.toUpperCase()}`;
  }

  onHelpClosed(type) {
    if (type === this.displayHelp) {
      this.displayHelp = null;
    }
  }

  hideHelp(type) {
    if (type === this.displayHelp) {
      this.updateHelp = true;

      this.ovhUserPref
        .assign(this.getHelpPreferenceKey(), false)
        .then()
        .finally(() => {
          this.updateHelp = false;
          this.displayHelp = null;
        });
    }
  }

  getIpsForTooltip = (ipsList) => {
    return ipsList.map(({ ip }) => ip).join(', ');
  };

  getStatusTooltipText(status) {
    const openStackStatusWithTooltip = [
      OPENSTACK_INSTANCE_STATUS.PAUSED,
      OPENSTACK_INSTANCE_STATUS.SHELVED,
      OPENSTACK_INSTANCE_STATUS.SHELVED_OFFLOADED,
      OPENSTACK_INSTANCE_STATUS.SUSPENDED,
    ];
    return openStackStatusWithTooltip.includes(status)
      ? this.$translate.instant(
          `pci_projects_project_instances_status_${status}_TOOLTIP`,
        )
      : null;
  }
}
