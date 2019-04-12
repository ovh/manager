import get from 'lodash/get';
import map from 'lodash/map';

import Container from '../container.class';

import {
  OBJECT_CONTAINER_TYPES,
} from '../containers.constants';

export default class PciStoragesContainersAddController {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    PciProjectStorageBlockService,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
  }

  $onInit() {
    this.displaySelectedRegion = false;
    this.displaySelectedType = false;

    this.types = OBJECT_CONTAINER_TYPES;
    this.typesList = map(
      this.types,
      type => ({
        id: type,
        name: this.$translate.instant(`pci_projects_project_storages_containers_add_type_${type}_description`),
      }),
    );

    this.loadings = {
      regions: true,
      types: false,
      save: false,
    };

    this.container = new Container({
      archive: this.archive,
    });

    return this.$translate.refresh()
      .then(() => this.loadMessages())
      .then(() => this.PciProjectStorageBlockService.getAvailablesRegions(this.projectId))
      .then((regions) => {
        this.regions = regions;
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_add_error_query',
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.storages.containers.add',
        );
      })
      .finally(() => {
        this.loadings.regions = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.storages.containers.add');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.storages.containers.add',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onRegionsFocus() {
    this.displaySelectedRegion = false;
  }

  onRegionChange() {
    this.displaySelectedRegion = true;
  }

  onTypesFocus() {
    this.displaySelectedType = false;
  }

  onTypeChange() {
    this.displaySelectedType = true;
    this.container.containerType = this.selectedType.id;
  }

  add() {
    this.loadings.save = true;

    return this.PciProjectStorageContainersService
      .addContainer(this.projectId, this.container)
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_containers_add_success_message',
            { container: this.container.name },
          ),
          'pci.projects.project.storages.containers',
        );

        return this.goBack(true);
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_add_error_post',
            { message: get(err, 'data.message', '') },
          ),
          'pci.projects.project.storages.containers.add',
        );
      })
      .finally(() => {
        this.loadings.save = false;
      });
  }
}
