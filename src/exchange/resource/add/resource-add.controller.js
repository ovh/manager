angular.module('Module.exchange.controllers').controller(
  'ExchangeAddResourceController',
  class ExchangeAddResourceController {
    constructor($scope, Exchange, ExchangeResources, navigation, $translate, messaging) {
      this.services = {
        $scope,
        Exchange,
        ExchangeResources,
        navigation,
        $translate,
        messaging,
      };

      this.$routerParams = Exchange.getParams();
      this.takenEmails = [];
      this.model = {
        displayName: '',
        capacity: 0,
        resourceEmailAddress: '',
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
          if (!_.isEmpty(data.availableDomains) && !_.isEmpty(data.types)) {
            this.availableTypes = data.types;
            this.availableDomains = data.availableDomains;
            this.takenEmails = data.takenEmails;
            this.model.resourceType = _.first(this.availableTypes);
            this.model.resourceEmailDomain = _.first(this.availableDomains);
          } else {
            this.services.navigation.resetAction();
            this.services.messaging.writeError(
              this.services.$translate.instant('exchange_tab_RESOURCES_no_domain_warning'),
              data,
            );
          }
        })
        .catch((failure) => {
          this.services.navigation.resetAction();
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_tab_RESOURCES_add_resource_failure'),
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
            this.services.$translate.instant('exchange_tab_RESOURCES_add_resource_success'),
            data,
          );
        })
        .catch((failure) => {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_tab_RESOURCES_add_resource_failure'),
            failure,
          );
        })
        .finally(() => {
          this.services.navigation.resetAction();
        });
    }

    buildEmailAddress() {
      if (_.isEmpty(this.model.resourceEmailDomain)) {
        return '';
      }

      return `${this.model.resourceEmailAddress}@${
        this.model.resourceEmailDomain.name
      }`.toLowerCase();
    }

    checkTakenEmails() {
      this.takenEmailError = false;

      if (!_.isEmpty(this.takenEmails) && !_.isEmpty(this.model.resourceEmailAddress)) {
        _(this.takenEmails).forEach((email) => {
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

      const emailAddressIsCorrect = !_.isEmpty(this.model.resourceEmailAddress)
        && this.model.resourceEmailAddress.length <= 64;
      const resourceTypeIsSelected = !_.isEmpty(this.model.resourceType);
      const displayNameIsCorrect = !_.isEmpty(this.model.displayName)
        && this.model.displayName.length <= 256;
      const capacityIsCorrect = this.model.capacity != null
        && this.model.capacity >= 0
        && this.model.capacity <= 1024;
      const emailIsFree = !this.takenEmailError;

      return (
        emailAddressIsCorrect
        && resourceTypeIsSelected
        && resourceTypeIsSelected
        && displayNameIsCorrect
        && capacityIsCorrect
        && emailIsFree
      );
    }
  },
);
