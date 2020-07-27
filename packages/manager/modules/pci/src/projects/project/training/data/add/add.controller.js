import get from 'lodash/get';

export default class PciTrainingDataAddController {
  /* @ngInject */
  constructor(
    PciProjectStorageContainersService,
    PciProjectTrainingDataService,
    CucCloudMessage,
    CucRegionService,
    $translate,
  ) {
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.PciProjectTrainingDataService = PciProjectTrainingDataService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.$translate = $translate;
  }

  $onInit() {
    // Load available regions
    this.allRegionsLoaded = false;
    this.regions()
      .then((regions) => {
        this.regions = regions;
      })
      .finally(() => {
        this.allRegionsLoaded = true;
      });

    // Load available users
    this.allUsersLoaded = false;
    this.allUsers()
      .then((users) => {
        this.users = users.map((user) => {
          return {
            name: user.username,
            description: `${user.username} (${user.description})`,
          };
        });
      })
      .finally(() => {
        this.allUsersLoaded = true;
      });

    // Data payload
    this.data = {
      region: null,
      container: null,
      user: null,
    };

    this.loadMessages();

    // Load available object storage containers
    this.allContainers = [];
    this.allContainersLoaded = false;
    this.loadAllContainers();

    this.filteredContainers = [];
  }

  onRegionSubmit() {
    this.data.container = null;
    this.filteredContainers = this.filterContainers();
  }

  computeDataSpec() {
    return {
      container: this.data.container.name,
      name: this.data.name,
      region: this.data.region.name,
      containerRegion: this.data.container.region,
      user: this.data.user.name,
      sync: this.data.sync,
    };
  }

  onStepperFinish() {
    this.isSubmit = true;
    this.PciProjectTrainingDataService.attach(
      this.projectId,
      this.computeDataSpec(),
    )
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_jobs_list_submit_success',
          ),
        );
      })
      .catch((error) => {
        this.error = get(error, 'data.message');
      })
      .finally(() => {
        this.isSubmit = false;
      });
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.training.data.add',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  loadAllContainers() {
    this.PciProjectStorageContainersService.getAll(this.projectId)
      .then((containers) => {
        this.allContainers = containers;
      })
      .finally(() => {
        this.allContainersLoaded = true;
      });
  }

  filterContainers() {
    return this.allContainers
      .filter(
        ({ region, archive }) => region === this.data.region.name && !archive,
      )
      .map(({ name, region }) => {
        return {
          name,
          region,
          description: `${name} - ${this.data.region.name}`,
        };
      });
  }
}
