import get from 'lodash/get';
import map from 'lodash/map';

import Container from '../container.class';

import {
  OBJECT_CONTAINER_NAME_PATTERN,
  OBJECT_CONTAINER_OFFERS,
  OBJECT_CONTAINER_TYPE_OFFERS,
  OBJECT_CONTAINER_TYPES,
} from '../containers.constants';

export default class PciStoragesContainersAddController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucCloudMessage,
    PciProjectStorageBlockService,
    PciProjectStorageContainersService,
  ) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.OBJECT_CONTAINER_NAME_PATTERN = OBJECT_CONTAINER_NAME_PATTERN;
    this.OBJECT_CONTAINER_OFFERS = OBJECT_CONTAINER_OFFERS;
    this.OBJECT_CONTAINER_TYPE_OFFERS = OBJECT_CONTAINER_TYPE_OFFERS;
  }

  $onInit() {
    this.loadMessages();

    this.isLoading = false;
    this.loadingPrice = false;

    this.displaySelectedRegion = false;
    this.displaySelectedType = false;

    this.types = OBJECT_CONTAINER_TYPES;
    this.typesList = map(this.types, (type) => ({
      id: type,
      name: this.$translate.instant(
        `pci_projects_project_storages_containers_add_type_${type}_description`,
      ),
    }));

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
    this.loadingPrice = true;
    this.PciProjectStorageContainersService.getPriceEstimation(
      this.user.ovhSubsidiary,
    )
      .then((price) => {
        this.price = price;
        if (this.price !== null) {
          this.price.formatedPrice = this.getFormatedPrice(
            price.price / 100000000,
          );
        }
      })
      .finally(() => {
        this.loadingPrice = false;
      });
  }

  onTypeChange() {
    this.displaySelectedType = true;
    this.container.containerType = this.selectedType.id;
  }

  add() {
    this.atInternet.trackClick({
      name: `storage_container_create_${
        this.container.offer === 'storage' ? 'standard' : this.container.offer
      }_${this.container.region?.datacenterLocation}_${this.container
        .containerType || 'standard'}`,
      type: 'action',
    });
    this.isLoading = true;
    return this.PciProjectStorageContainersService.addContainer(
      this.projectId,
      this.container,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_containers_add_success_message',
            {
              container: this.container.name,
            },
          ),
        ),
      )
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

  cancel() {
    this.atInternet.trackClick({
      name: 'storage_container_cancel_creation',
      type: 'action',
    });
    return this.cancelCreate();
  }

  getFormatedPrice(price) {
    const languageLocale = this.user.language.replace('_', '-');
    return Intl.NumberFormat(languageLocale, {
      style: 'currency',
      currency: this.user.currency.code,
      maximumSignificantDigits: 1,
    }).format(price);
  }
}
