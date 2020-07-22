export default class PciTrainingJobsListController {
  /* @ngInject */
  constructor(
    $state,
    PciProjectStorageContainersService,
    CucCloudMessage,
    CucRegionService,
  ) {
    this.$state = $state;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.loadMessages();
    this.allContainers = [];
    this.allContainersLoaded = false;

    this.loadAllContainers().then(() => {
      this.allDataList = this.dataList.map((elt) => {
        // Link each data to its related PCS container
        const containerId = this.getContainerId(elt.region, elt.name);
        const cloneElt = { ...elt };
        cloneElt.link = containerId;
        return cloneElt;
      });
    });
  }

  getContainerId(region, name) {
    const filtered = this.allContainers.filter((container) => {
      return container.name === name && container.region === region;
    });
    if (filtered.length > 0) {
      const containerId = filtered[0].id;
      return this.containerLink(containerId);
    }
    return null;
  }

  loadAllContainers() {
    return this.PciProjectStorageContainersService.getAll(this.projectId)
      .then((containers) => {
        this.allContainers = containers;
      })
      .finally(() => {
        this.allContainersLoaded = true;
      });
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
