import get from 'lodash/get';
import map from 'lodash/map';

import Container from '../container.class';

import {
  OBJECT_CONTAINER_NAME_PATTERN,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFERS,
  OBJECT_CONTAINER_OFFERS_LABELS,
  OBJECT_CONTAINER_TYPE_OFFERS,
  OBJECT_CONTAINER_TYPES,
  STORAGE_PRICES_LINK,
  STORAGES_CONTAINER_NAME_PATTERN,
  OBJECT_CONTAINER_DEPLOIMENT_MODES_LABELS,
  OBJECT_CONTAINER_DEPLOIMENT_MODES,
  OBJECT_CONTAINER_OFFER_SWIFT,
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
    OvhApiCloudProjectRegion,
    coreConfig,
  ) {
    const { ovhSubsidiary } = coreConfig.getUser();

    this.$translate = $translate;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectStorageBlockService = PciProjectStorageBlockService;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.OvhApiCloudProjectRegion = OvhApiCloudProjectRegion;
    this.storagePricesLink =
      STORAGE_PRICES_LINK[ovhSubsidiary] || STORAGE_PRICES_LINK.DEFAULT;

    this.STORAGES_CONTAINER_NAME_PATTERN = STORAGES_CONTAINER_NAME_PATTERN;
    this.OBJECT_CONTAINER_NAME_PATTERN = OBJECT_CONTAINER_NAME_PATTERN;
    this.OBJECT_CONTAINER_OFFERS = OBJECT_CONTAINER_OFFERS;
    this.OBJECT_CONTAINER_OFFERS_LABELS = OBJECT_CONTAINER_OFFERS_LABELS;
    this.OBJECT_CONTAINER_TYPE_OFFERS = OBJECT_CONTAINER_TYPE_OFFERS;
    this.OBJECT_CONTAINER_DEPLOIMENT_MODES_LABELS = OBJECT_CONTAINER_DEPLOIMENT_MODES_LABELS;
    this.OBJECT_CONTAINER_DEPLOIMENT_MODES = OBJECT_CONTAINER_DEPLOIMENT_MODES;
    this.OBJECT_CONTAINER_OFFER_SWIFT = OBJECT_CONTAINER_OFFER_SWIFT;
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
      deploimentMode: null,
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
    return OBJECT_CONTAINER_OFFER_STORAGE_STANDARD === this.container.offer;
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

  onOfferFocus() {
    this.displaySelectedOffer = false;
    this.container.deploimentMode = null;
  }

  onOfferSubmit() {
    this.displaySelectedOffer = true;
  }

  onContainerSolutionChange() {
    this.container.region = null;
  }

  onRegionsFocus() {
    this.displaySelectedRegion = false;
    this.container.region = null;

    this.reloadRegions = true;
  }

  reloadRegionsEnd() {
    this.reloadRegions = false;
  }

  onRegionChange() {
    this.displaySelectedRegion = true;

    if (this.container.region.enabled === false) {
      this.isAddingRegion = true;
      this.addRegion();
    }
  }

  addRegion() {
    return this.OvhApiCloudProjectRegion.v6()
      .addRegion(
        { serviceName: this.projectId },
        //
        { region: this.container.region.name },
      )
      .$promise.then(() => {
        return this.OvhApiCloudProjectRegion.AvailableRegions()
          .v6()
          .resetQueryCache();
      })
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_projects_project_storages_containers_add_add_region_success',
            {
              code: this.container.region.name,
            },
          ),
          'pci.projects.project.storages.containers.add',
        );
        this.isAddingRegion = false;
        this.isAddingRegionError = false;
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_storages_containers_add_add_region_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'pci.projects.project.storages.containers.add',
        );
        this.isAddingRegion = false;
        this.isAddingRegionError = true;
      });
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

  handleBucketVersioningChange(versioning) {
    if (versioning?.status === 'enabled') {
      this.container.versioning = versioning;
    } else {
      delete this.container.versioning;
    }
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
        const translationKey =
          this.userModel.createOrLinkedMode ===
          CONTAINER_USER_ASSOCIATION_MODES.CREATE
            ? 'pci_projects_project_storages_containers_add_success_message_with_user_creation'
            : 'pci_projects_project_storages_containers_add_success_message';
        const message = this.$translate.instant(translationKey, {
          container: this.container.name,
          userName: this.userModel.createMode?.user?.username,
        });
        const trackingTag = `_add::${containerOffer}_${dataCenterLocation}::${containerTypeOffer}creation_confirmation`;

        return this.goBackWithTrackingPage({
          message,
          type: 'success',
          reload: true,
          trackingTag,
        });
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
