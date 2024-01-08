export default class PciInstanceController {
  /* @ngInject */
  constructor(
    $translate,
    coreConfig,
    CucCloudMessage,
    ovhManagerRegionService,
    PciProjectsProjectInstanceService,
    PciProject,
  ) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.PciProject = PciProject;
  }

  $onInit() {
    this.loadMessages();
    this.globalRegionsUrl = this.PciProject.getDocumentUrl('GLOBAL_REGIONS');
    this.localZoneUrl = this.PciProject.getDocumentUrl('LOCAL_ZONE');
  }

  displayBillingActionButton() {
    return (
      !this.instance.isMonthlyBillingActivated() &&
      this.instance.flavor.planCodes.monthly
    );
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.instances.instance',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
