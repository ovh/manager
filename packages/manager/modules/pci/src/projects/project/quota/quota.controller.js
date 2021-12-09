import {
  RESTRICTED_CORES,
  RESTRICTED_RAM,
  RESTRICTED_INSTANCES,
} from './quota.constants';
import { QUOTA_INCREASE_MODES } from './increase-request/increase.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    coreURLBuilder,
    CucCloudMessage,
    ovhManagerRegionService,
    OvhApiCloudProject,
    PciProjectQuota,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.PciProjectQuota = PciProjectQuota;
  }

  $onInit() {
    this.isLoading = false;

    this.loadMessages();

    [this.paymentmeanUrl, this.supportUrl] = this.coreURLBuilder.buildURLs([
      { application: 'dedicated', path: '#/billing/mean' },
      { application: 'dedicated', path: '#/support' },
    ]);

    this.model = {
      autoScaling: !this.project.manualQuota,
    };

    this.loaders = {
      autoScaling: false,
    };
    this.PciProjectQuota.setServiceOptions(this.serviceOptions);
    this.increaseQuotaUrls = {
      contactSupport: `${this.$state.href(this.$state.$current)}/increase/${
        QUOTA_INCREASE_MODES.CONTACT_SUPPORT
      }`,
      buyCredits: `${this.$state.href(this.$state.$current)}/increase/${
        QUOTA_INCREASE_MODES.BUY_CREDITS
      }`,
    };
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.quota');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.quota',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  isQuotaRestricted() {
    const [quota] = this.quotas;
    return (
      quota.maxInstances === RESTRICTED_INSTANCES &&
      quota.maxCores === RESTRICTED_CORES &&
      quota.maxRam === RESTRICTED_RAM
    );
  }

  unleashAccount() {
    this.isLoading = true;
    return this.OvhApiCloudProject.v6()
      .unleash(
        {
          serviceName: this.projectId,
        },
        {},
      )
      .$promise.then(() => this.$state.reload())
      .catch(({ status }) => {
        if (status === 403) {
          this.CucCloudMessage.error(
            this.$translate.instant(
              'pci_projects_project_quota_already_unleashed',
            ),
          );
        } else {
          this.CucCloudMessage.error(
            this.$translate.instant('pci_projects_project_quota_unleash_error'),
          );
        }
      });
  }

  onAutoScalingQuotaSwitchChange(modelValue) {
    this.loaders.autoScaling = true;

    return this.OvhApiCloudProject.v6()
      .put(
        {
          serviceName: this.projectId,
        },
        {
          manualQuota: !modelValue,
        },
      )
      .$promise.catch(() => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_quota_autoscaling_error',
          ),
        );

        this.model.autoScaling = !this.model.autoScaling;
      })
      .finally(() => {
        this.loaders.autoScaling = false;
      });
  }
}
