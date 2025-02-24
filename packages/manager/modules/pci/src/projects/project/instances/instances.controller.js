import isEmpty from 'lodash/isEmpty';

import map from 'lodash/map';
import Instance from '../../../components/project/instance/instance.class';
import { getCriteria } from '../project.utils';
import {
  INSTANCE_HELP_REFERENCE_KEY,
  OPENSTACK_INSTANCE_STATUS,
  POLLER_INSTANCES,
} from './instances.constants';

export default class CloudProjectComputeInfrastructureListCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $state,
    coreConfig,
    CucCloudMessage,
    ovhManagerRegionService,
    ovhUserPref,
    PciProjectsProjectInstanceService,
    Poller,
    CHANGELOG,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$state = $state;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.ovhUserPref = ovhUserPref;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.Poller = Poller;
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    this.hasVrack = !isEmpty(this.vrack);
    this.loadMessages();
    this.checkHelpDisplay();

    this.criteria = getCriteria('id', this.instanceId);

    this.fetchInstances();
  }

  fetchInstances() {
    this.loading = true;
    return this.$q
      .all({
        instances: this.PciProjectsProjectInstanceService.getAll(
          this.projectId,
          this.customerRegions,
        ),
        floatingIps: this.getFloatingIps(),
      })
      .then(({ instances, floatingIps }) => {
        const updatedInstances = map(instances, (instance) => ({
          ...instance,
          floatingIp: floatingIps.find(
            (floatingIp) => floatingIp?.associatedEntity?.id === instance.id,
          ),
        }));
        return this.$q.all(
          updatedInstances.map((instance) => {
            return this.PciProjectsProjectInstanceService.getInstanceFlavor(
              this.projectId,
              instance,
            ).then((flavor) => {
              return new Instance({
                ...instance,
                flavor,
              });
            });
          }),
        );
      })
      .then((instances) => {
        if (instances.length === 0) {
          this.$state.go('pci.projects.project.instances.onboarding');
        } else {
          this.instances = instances;
          this.instancesRegions = Array.from(
            new Set(instances.map(({ region }) => region)),
          );
          this.loading = false;
          this.pollInstances();
        }
      });
  }

  pollInstances() {
    this.instances.forEach((instance) => {
      POLLER_INSTANCES.filter((poller) =>
        poller.needsPolling(instance),
      ).forEach((poller) => {
        const endPointUrl = `/cloud/project/${this.projectId}/instance/${instance.id}`;
        this.Poller.poll(endPointUrl, null, {
          interval: 5000,
          successRule: poller.isPolled,
          namespace: poller.namespace,
          notifyOnError: false,
        })
          .then(() => this.refreshInstances())
          .then(() =>
            this.CucCloudMessage.success(
              this.$translate.instant(poller.successMessage, {
                instance: instance.name,
              }),
            ),
          );
      });
    });
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
      OPENSTACK_INSTANCE_STATUS.SHUTOFF,
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
