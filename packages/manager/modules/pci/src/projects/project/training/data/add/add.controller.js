import get from 'lodash/get';

export default class PciTrainingDataAddController {
  /* @ngInject */
  constructor(
    PciProjectStorageContainersService,
    PciProjectTrainingDataService,
    $translate,
    atInternet,
  ) {
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.PciProjectTrainingDataService = PciProjectTrainingDataService;
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
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
      name: '',
      region: null,
      container: null,
      user: null,
    };

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

  cliCommand() {
    const cli = [
      'data new',
      this.data.name,
      '\\\n\t',
      '--storage ovh',
      '\\\n\t',
      `--tags container=${this.data.container.name}`,
      '\\\n\t',
      `--tags container-region=${this.data.container.region}`,
    ].join(' ');

    if (this.data.sync) {
      return `${cli} \\\n\t --sync from-object-storage`;
    }

    return cli;
  }

  onStepperFinish() {
    this.atInternet.trackClick({
      name:
        'public-cloud::pci::projects::project::training::data::add::confirm',
      type: 'action',
    });

    this.isSubmit = true;
    this.PciProjectTrainingDataService.attach(
      this.projectId,
      this.computeDataSpec(),
    )
      .then(() => {
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_training_data_list_submit_success',
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
      .filter(({ archive }) => !archive)
      .map(({ name, region }) => {
        return {
          name,
          region,
          description: `${name} - ${region}`,
        };
      });
  }
}
