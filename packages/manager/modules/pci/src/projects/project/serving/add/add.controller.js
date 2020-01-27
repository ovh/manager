import get from 'lodash/get';


export default class PciServingAddController {
  /* @ngInject */
  constructor($translate, PciProjectStorageContainersService, CucCloudMessage) {
    this.$translate = $translate;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.NEW = 'new';
    this.ATTACH = 'attach';

    this.model = {
      region: null,
      description: null,
      containerSelect: null,
      containerInput: null,
    };

    this.attachType = this.ATTACH;

    this.loading = false;

    this.containers = [];
    this.containersFilter = [];

    this.listContainers();

    this.loadMessages();
  }

  listContainers() {
    this.containerLoading = true;
    this.PciProjectStorageContainersService.getAll(
      this.projectId,
    ).then((containers) => {
      this.containers = containers;
      this.filterContainers();
    }).finally(() => {
      this.containerLoading = false;
    });
  }

  filterContainers() {
    if (this.model.region && this.containers.length > 0) {
      this.containersFilter = this.containers
        .filter(({ region, archive }) => region === this.model.region.name && !archive)
        .map(({ name }) => name);
    }

    if (!this.containersFilter.length) {
      this.attachType = this.NEW;
    } else {
      this.attachType = this.ATTACH;
    }
  }

  onStepperFinish() {
    this.loading = true;

    const container = this.attachType === this.ATTACH
      ? this.model.containerSelect : this.model.containerInput;

    return this.addNamespace({
      region: this.model.region.name,
      description: this.model.description,
      container,
    }).catch((error) => {
      this.loading = false;

      this.CucCloudMessage.error(
        this.$translate.instant('pci_projects_project_serving_add_error', {
          errorMessage: get(error, 'data.message'),
        }),
        'pci.projects.project.serving.add',
      );
    });
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.serving.add',
      {
        onMessage: this.refreshMessages.bind(this),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
