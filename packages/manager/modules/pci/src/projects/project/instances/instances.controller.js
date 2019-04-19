export default class CloudProjectComputeInfrastructureListCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudMessage,
    CucRegionService,
    PciProjectsProjectInstanceService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.isLoading = false;

    return this.initLoaders();
  }

  initLoaders() {
    this.isLoading = true;

    this.loadMessages();
    return this.PciProjectsProjectInstanceService.getAll(this.projectId)
      .then((instances) => {
        this.instances = instances;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.instances');
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
}
