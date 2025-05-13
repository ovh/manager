import { THREE_AZ_REGION } from '../../project.constants';

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
    this.THREE_AZ_REGION = THREE_AZ_REGION;
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    this.loadMessages();
    this.globalRegionsUrl = this.PciProject.getDocumentUrl('GLOBAL_REGIONS');
    this.localZoneUrl = this.PciProject.getDocumentUrl('LOCAL_ZONE');
    this.zone3azUrl = this.PciProject.getDocumentUrl('REGIONS_3AZ');

    this.is3az = this.instance.planCode.includes('3AZ');

    this.regionsTypesAvailability = {};
    this.fetchRegionsTypesAvailability();
  }

  fetchRegionsTypesAvailability() {
    this.PciProjectsProjectInstanceService.getRegionsTypesAvailability(
      this.projectId,
    ).then((regionsTypesAvailability) => {
      this.regionsTypesAvailability = regionsTypesAvailability;
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
