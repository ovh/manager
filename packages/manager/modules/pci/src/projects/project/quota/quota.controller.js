import {
  RESTRICTED_CORES,
  RESTRICTED_RAM,
  RESTRICTED_INSTANCES,
} from './quota.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    coreURLBuilder,
    CucCloudMessage,
    ovhManagerRegionService,
    OvhApiCloudProject,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.coreURLBuilder = coreURLBuilder;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.OvhApiCloudProject = OvhApiCloudProject;
  }

  $onInit() {
    this.isLoading = false;

    this.loadMessages();

    [this.paymentmeanUrl, this.supportUrl] = this.coreURLBuilder.buildURLs([
      { application: 'dedicated', path: '#/billing/mean' },
      { application: 'dedicated', path: '#/support' },
    ]);

    this.model = {
      manualQuota: this.project.manualQuota,
    };

    this.loaders = {
      manualQuota: false,
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

  onManualQuotaSwitchChange(modelValue) {
    this.loaders.manualQuota = true;

    return this.OvhApiCloudProject.v6()
      .put(
        {
          serviceName: this.projectId,
        },
        {
          manualQuota: modelValue,
        },
      )
      .$promise.catch(() => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_quota_autoscaling_error',
          ),
        );

        this.model.manualQuota = !this.model.manualQuota;
      })
      .finally(() => {
        this.loaders.manualQuota = false;
      });
  }
}
