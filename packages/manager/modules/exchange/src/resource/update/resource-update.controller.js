import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

export default class ExchangeUpdateResourceController {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeResources,
    $translate,
    messaging,
    navigation,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeResources,
      $translate,
      messaging,
      navigation,
    };

    this.$routerParams = wucExchange.getParams();
    $scope.updateResource = () => this.updateResource();
    $scope.loadResourceData = () => this.loadResourceData();
    $scope.isValid = () => this.isValid();
  }

  loadResourceData() {
    this.isLoading = true;
    return this.services.ExchangeResources.getResourcesOptions(
      this.$routerParams.organization,
      this.$routerParams.productId,
    )
      .then((data) => {
        const {
          displayName,
          capacity,
          resourceEmailAddress,
          company,
          showMeetingDetails,
          allowConflict,
          deleteComments,
          deleteSubject,
          location,
          maximumDuration,
          bookingWindow,
        } = this.services.navigation.currentActionData;
        const splitedEmail = resourceEmailAddress.split('@');
        this.availableShowMeetingDetails = data.showMeetingDetailsEnum;
        this.availableDomains = [resourceEmailAddress.split('@')[1]];
        this.takenEmails = data.takenEmails;
        this.model = {
          displayName,
          capacity,
          resourceEmailAddress: splitedEmail[0],
          resourceEmailDomain: splitedEmail[1],
          company,
          showMeetingDetails,
          allowConflict,
          deleteComments,
          deleteSubject,
          location,
          maximumDuration,
          bookingWindow,
        };
      })
      .catch((failure) => {
        this.services.navigation.resetAction();
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_RESOURCES_edit_resource_error',
          ),
          failure,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  prepareModel() {
    this.model.resourceEmailAddress = this.buildEmailAddress();
    delete this.model.resourceEmailDomain;

    return this.model;
  }

  buildEmailAddress() {
    if (isEmpty(this.model.resourceEmailDomain)) {
      return '';
    }

    return `${this.model.resourceEmailAddress}@${this.model.resourceEmailDomain}`.toLowerCase();
  }

  checkTakenEmails() {
    this.takenEmailError = false;

    if (
      !isEmpty(this.takenEmails) &&
      !isEmpty(this.model.resourceEmailAddress)
    ) {
      const emailAddress = this.buildEmailAddress();
      this.takenEmails.forEach((email) => {
        if (
          emailAddress === email.toLowerCase() &&
          emailAddress !==
            this.services.navigation.currentActionData.resourceEmailAddress
        ) {
          this.takenEmailError = true;
          return false;
        }

        return true;
      });
    }
  }

  updateResource() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );
    this.prepareModel();

    this.services.ExchangeResources.updateResource(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.services.navigation.currentActionData.resourceEmailAddress,
      this.model,
    )
      .then((data) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_RESOURCES_edit_resource_success',
          ),
          data,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_RESOURCES_edit_resource_error',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  isValid() {
    if (!this.model) {
      return false;
    }
    const emailIsFree = !this.takenEmailError;
    const displayNameIsValid =
      isString(this.model.displayName) &&
      !isEmpty(this.model.displayName) &&
      this.model.displayName.length <= 256;
    const capacityIsValid =
      isNumber(this.model.capacity) &&
      this.model.capacity >= 0 &&
      this.model.capacity <= 1024;

    return displayNameIsValid && capacityIsValid && emailIsFree;
  }
}
