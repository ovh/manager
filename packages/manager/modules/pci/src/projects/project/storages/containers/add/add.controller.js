import get from 'lodash/get';
import map from 'lodash/map';

import Container from '../container.class';

import {
  OBJECT_CONTAINER_NAME_PATTERN,
  OBJECT_CONTAINER_OFFER_HIGH_PERFORMANCE,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFERS,
  OBJECT_CONTAINER_OFFERS_LABELS,
  OBJECT_CONTAINER_TYPE_OFFERS,
  OBJECT_CONTAINER_TYPES,
  STORAGE_PRICES_LINK,
} from '../containers.constants';

import { CONTAINER_USER_ASSOCIATION_MODES } from './components/associate-user-to-container/constant';

export default class PciStoragesContainersAddController {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    CucCloudMessage,
    PciProjectStorageBlockService,
    PciProjectStorageContainersService,
    coreConfig,
  ) {
    const { ovhSubsidiary } = coreConfig.getUser();

    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.storagePricesLink =
      STORAGE_PRICES_LINK[ovhSubsidiary] || STORAGE_PRICES_LINK.DEFAULT;

    this.OBJECT_CONTAINER_NAME_PATTERN = OBJECT_CONTAINER_NAME_PATTERN;
    this.OBJECT_CONTAINER_OFFERS = OBJECT_CONTAINER_OFFERS;
    this.OBJECT_CONTAINER_OFFERS_LABELS = OBJECT_CONTAINER_OFFERS_LABELS;
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
    this.container.region = null;

    this.userModel = {
      linkedMode: {
        selected: null,
        credential: null,
        isInProgress: false, // HTTP request
      },
      createMode: {
        user: null, // once generate new user
        credential: null, // new s3 user credential
        description: null, // new s3 user description
        isInProgress: false,
      },
      createOrLinkedMode: null,
    };
    if (!this.archive) this.setUsersForContainerCreation();
    this.preselectStepItem();
  }

  /**
   * Use this to preselect an item regarding current step
   */
  preselectStepItem() {
    const { steps } = this.redirectTarget;
    const currentStep = (this.currrentStep || 0) + 1; // to have human start count

    if (steps && currentStep === 1) {
      this.container.offer = steps[`STEP_${currentStep}`];
    }
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

  setUsersForContainerCreation() {
    this.users = this.allUserList.filter((user) => user.status === 'ok');
  }

  isRightOffer() {
    return [
      OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
      OBJECT_CONTAINER_OFFER_HIGH_PERFORMANCE,
    ].includes(this.container.offer);
  }

  isReadyForValidation() {
    const { createOrLinkedMode } = this.userModel;
    const { createMode, linkedMode } = this.userModel;

    return (
      createOrLinkedMode &&
      ((createMode.user && createMode.description) || linkedMode.selected)
    );
  }

  getUserOwnerId() {
    const { createMode, linkedMode } = this.userModel;

    return createMode?.user?.id || linkedMode?.selected?.id;
  }

  onContainerSolutionChange() {
    this.container.region = null;
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
    const containerOffer =
      this.container.offer === 'storage' ? 'standard' : this.container.offer;
    const containerTypeOffer = this.container.containerType
      ? `${this.container.containerType}::`
      : '';
    const dataCenterLocation = this.container.region.datacenterLocation;

    this.atInternet.trackClick({
      name: `storage_container_create_${containerOffer}_${dataCenterLocation}_${this
        .container.containerType || 'standard'}`,
      type: 'action',
    });
    this.isLoading = true;
    this.container.ownerId = this.getUserOwnerId();
    return this.PciProjectStorageContainersService.addContainer(
      this.projectId,
      this.container,
    )
      .then(() => {
        const message =
          this.userModel.createOrLinkedMode ===
          CONTAINER_USER_ASSOCIATION_MODES.CREATE
            ? 'pci_projects_project_storages_containers_add_success_message_with_user_creation'
            : 'pci_projects_project_storages_containers_add_success_message';

        return this.goBackWithTrackingPage(
          this.$translate.instant(message, {
            container: this.container.name,
            userName: this.userModel.createMode?.user?.username,
          }),
          'success',
          `_add::${containerOffer}_${dataCenterLocation}::${containerTypeOffer}creation_confirmation`,
        );
      })
      .catch((err) => {
        this.trackPage(
          `_add::${containerOffer}_${dataCenterLocation}::${containerTypeOffer}creation_error`,
        );
        return this.CucCloudMessage.error(
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
