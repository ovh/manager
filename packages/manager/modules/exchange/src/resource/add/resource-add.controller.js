import forEach from 'lodash/forEach';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';

export default class ExchangeAddResourceController {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeResources,
    navigation,
    $translate,
    messaging,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeResources,
      navigation,
      $translate,
      messaging,
    };

    this.$routerParams = wucExchange.getParams();
    this.takenEmails = [];
    this.model = {
      displayName: '',
      capacity: 0,
      resourceEmailAddress: '',
      company: '',
    };

    $scope.addResource = () => this.addResource();
    $scope.isValid = () => this.isValid();
    $scope.loadResourceData = () => this.loadResourceData();
  }

  prepareModel() {
    this.model.resourceEmailAddress = this.buildEmailAddress();
    delete this.model.resourceEmailDomain;

    return this.model;
  }

  loadResourceData() {
    return this.services.ExchangeResources.getResourcesOptions(
      this.$routerParams.organization,
      this.$routerParams.productId,
    )
      .then((data) => {
        if (!isEmpty(data.availableDomains) && !isEmpty(data.types)) {
          this.availableTypes = data.types;
          this.availableDomains = data.availableDomains;
          this.takenEmails = data.takenEmails;
          this.model.resourceType = head(this.availableTypes);
          this.model.resourceEmailDomain = head(this.availableDomains);
        } else {
          this.services.navigation.resetAction();
          this.services.messaging.writeError(
            this.services.$translate.instant(
              'exchange_tab_RESOURCES_no_domain_warning',
            ),
            data,
          );
        }
      })
      .catch((failure) => {
        this.services.navigation.resetAction();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_RESOURCES_add_resource_failure',
          ),
          failure,
        );
      });
  }

  addResource() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );
    this.prepareModel();

    return this.services.ExchangeResources.addResource(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.model,
    )
      .then((data) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_RESOURCES_add_resource_success',
          ),
          data,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_RESOURCES_add_resource_failure',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  buildEmailAddress() {
    if (isEmpty(this.model.resourceEmailDomain)) {
      return '';
    }

    return `${this.model.resourceEmailAddress}@${this.model.resourceEmailDomain.name}`.toLowerCase();
  }

  checkTakenEmails() {
    this.takenEmailError = false;

    if (
      !isEmpty(this.takenEmails) &&
      !isEmpty(this.model.resourceEmailAddress)
    ) {
      forEach(this.takenEmails, (email) => {
        if (this.buildEmailAddress() === email.toLowerCase()) {
          this.takenEmailError = true;
          return false;
        }

        return true;
      });
    }
  }

  isValid() {
    if (this.model == null) {
      return false;
    }

    const emailAddressIsCorrect =
      !isEmpty(this.model.resourceEmailAddress) &&
      this.model.resourceEmailAddress.length <= 64;
    const resourceTypeIsSelected = !isEmpty(this.model.resourceType);
    const displayNameIsCorrect =
      !isEmpty(this.model.displayName) && this.model.displayName.length <= 256;
    const capacityIsCorrect =
      this.model.capacity != null &&
      this.model.capacity >= 0 &&
      this.model.capacity <= 1024;
    const emailIsFree = !this.takenEmailError;

    return (
      emailAddressIsCorrect &&
      resourceTypeIsSelected &&
      resourceTypeIsSelected &&
      displayNameIsCorrect &&
      capacityIsCorrect &&
      emailIsFree
    );
  }
}
