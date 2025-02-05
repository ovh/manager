export default class PciInstanceController {
  /* @ngInject */
  constructor(
    $translate,
    coreConfig,
    CucCloudMessage,
    ovhManagerRegionService,
    PciProjectsProjectInstanceService,
    PciProject,
    CHANGELOG,
  ) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.PciProject = PciProject;
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    this.loadMessages();
    this.globalRegionsUrl = this.PciProject.getDocumentUrl('GLOBAL_REGIONS');
    this.localZoneUrl = this.PciProject.getDocumentUrl('LOCAL_ZONE');
    this.zone3azUrl = this.PciProject.getDocumentUrl('REGIONS_3AZ');

    this.is3az = this.instance.planCode.includes('3AZ');

    this.fetch3AZAvailability();
  }

  fetch3AZAvailability() {
    return this.PciProjectsProjectInstanceService.getProductAvailability(
      this.projectId,
      this.coreConfig.getUser().ovhSubsidiary,
      'instance',
    ).then(({ plans }) => {
      this.are3AzRegionsAvailable = plans.some((plan) =>
        plan.regions.some((region) => region.type === 'region-3-az'),
      );
    });
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
