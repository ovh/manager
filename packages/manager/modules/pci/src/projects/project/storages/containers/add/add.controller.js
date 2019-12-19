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
    this.loadMessages();

    this.isLoading = false;

    this.displaySelectedRegion = false;
    this.displaySelectedType = false;

    this.types = OBJECT_CONTAINER_TYPES;
    this.typesList = map(
      this.types,
      (type) => ({
        id: type,
        name: this.$translate.instant(`pci_projects_project_storages_containers_add_type_${type}_description`),
      }),
    );

    this.container = new Container({
      archive: this.archive,
    });
  }

  loadMessages() {
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
    this.isLoading = true;
    return this.PciProjectStorageContainersService
      .addContainer(this.projectId, this.container)
      .then(() => this.goBack(this.$translate.instant(
        'pci_projects_project_storages_containers_add_success_message',
        {
          container: this.container.name,
        },
      )))
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
        this.isLoading = false;
      });
  }
}
