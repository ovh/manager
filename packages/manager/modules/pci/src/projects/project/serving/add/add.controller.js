import get from 'lodash/get';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import keyBy from 'lodash/keyBy';

export default class PciServingAddController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectStorageContainersService,
    CucCloudMessage,
    CucRegionService,
    atInternet,
  ) {
    this.$translate = $translate;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucRegionService = CucRegionService;
    this.atInternet = atInternet;
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

    // Convert region code to user readable text
    this.namedRegion = mapValues(
      keyBy(
        map(this.regions, (region) => ({
          ...this.CucRegionService.getRegion(region.name),
          name: region.name,
          continentCode: region.continentCode,
          hasEnoughQuota: region.hasEnoughQuota(),
        })),
        'name',
      ),
      'microRegion.text',
    );

    this.listContainers();

    this.loadMessages();
  }

  listContainers() {
    this.containerLoading = true;
    this.PciProjectStorageContainersService.getAll(this.projectId)
      .then((containers) => {
        this.containers = containers;
        this.filterContainers();
      })
      .finally(() => {
        this.containerLoading = false;
      });
  }

  filterContainers() {
    if (this.model.region && this.containers.length > 0) {
      this.containersFilter = this.containers
        .filter(
          ({ region, archive }) =>
            region === this.model.region.name && !archive,
        )
        .map(({ name }) => {
          return {
            name,
            description: `${name} - ${this.model.region.name}`,
          };
        });
    }

    if (!this.containersFilter.length) {
      this.attachType = this.NEW;
    } else {
      this.attachType = this.ATTACH;
    }
  }

  onStepperFinish() {
    this.atInternet.trackClick({
      name: 'public-cloud::pci::projects::project::serving::add::submit',
      type: 'action',
    });

    this.loading = true;

    const container =
      this.attachType === this.ATTACH
        ? this.model.containerSelect.name
        : this.model.containerInput;

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
