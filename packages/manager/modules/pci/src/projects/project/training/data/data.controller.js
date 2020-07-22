export default class PciTrainingInstallController {
  /* @ngInject */
  constructor(CucCloudMessage, CucRegionService) {
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.loadMessages();
    this.guideUrl = '';
    this.allDataList = this.dataList.map((data) => {
      // Link each data to its related PCS container
      const containerLink = PciTrainingInstallController.getContainerId(
        data.containerRegion,
        data.container,
      );

      const cloneData = { ...data };
      cloneData.containerLink = containerLink;
      return cloneData;
    });
  }

  static getContainerId(region, name) {
    return PciTrainingInstallController.hexEncode(btoa(`${name}.${region}`));
  }

  // eslint-disable-next-line class-methods-use-this
  static hexEncode(string) {
    let hex;
    let i;

    let result = '';
    // eslint-disable-next-line no-plusplus
    for (i = 0; i < string.length; i++) {
      hex = string.charCodeAt(i).toString(16);
      result += `${hex}`.slice(-4);
    }

    return result;
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.data',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
