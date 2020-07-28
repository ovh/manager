export default class PciTrainingJobsListController {
  /* @ngInject */
  constructor($state, CucCloudMessage, CucRegionService) {
    this.$state = $state;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.loadMessages();

    this.allDataList = this.dataList.map((data) => {
      // Link each data to its related PCS container
      const containerLink = PciTrainingJobsListController.getContainerId(
        data.containerRegion,
        data.container,
      );

      const cloneData = { ...data };
      cloneData.containerLink = containerLink;
      return cloneData;
    });
  }

  static getContainerId(region, name) {
    return PciTrainingJobsListController.hexEncode(btoa(`${name}.${region}`));
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
      'pci.projects.project.training.data.list',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
