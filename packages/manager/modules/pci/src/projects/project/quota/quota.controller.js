import { RESTRICTED_CORES, RESTRICTED_RAM, RESTRICTED_INSTANCES } from './quota.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    CucCloudMessage,
    CucRegionService,
    OvhApiCloudProject,
    PCI_REDIRECT_URLS,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.PCI_REDIRECT_URLS = PCI_REDIRECT_URLS;
  }

  $onInit() {
    this.isLoading = false;

    this.loadMessages();

    this.paymentmeanUrl = this.PCI_REDIRECT_URLS[this.region].paymentMeans;
    this.supportUrl = this.PCI_REDIRECT_URLS[this.region].support;
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
    return quota.maxInstances === RESTRICTED_INSTANCES
    && quota.maxCores === RESTRICTED_CORES
    && quota.maxRam === RESTRICTED_RAM;
  }

  unleashAccount() {
    this.isLoading = true;
    return this.OvhApiCloudProject.v6().unleash({
      serviceName: this.projectId,
    }, {}).$promise.then(() => this.$state.reload())
      .catch(({ status }) => {
        if (status === 403) {
          this.CucCloudMessage.error(this.$translate.instant('pci_projects_project_quota_already_unleashed'));
        } else {
          this.CucCloudMessage.error(this.$translate.instant('pci_projects_project_quota_unleash_error'));
        }
      });
  }
}
