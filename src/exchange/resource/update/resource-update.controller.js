angular.module('Module.exchange.controllers').controller(
  'ExchangeUpdateResourceController',
  class ExchangeUpdateResourceController {
    constructor($scope, Exchange, ExchangeResources, $filter, $translate, messaging, navigation) {
      this.services = {
        $scope,
        Exchange,
        ExchangeResources,
        $filter,
        $translate,
        messaging,
        navigation,
      };

      this.$routerParams = Exchange.getParams();
      this.model = navigation.currentActionData;
      this.model.slicedEmail = $filter('wucSliceEmail')(this.model.resourceEmailDisplayName, 20);

      $scope.updateResource = () => this.updateResource();
    }

    updateResource() {
      this.services.messaging.writeSuccess(
        this.services.$translate.instant('exchange_dashboard_action_doing'),
      );

      this.services.ExchangeResources.updateResource(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.model,
      )
        .then((data) => {
          this.services.messaging.writeSuccess(
            this.services.$translate.instant('exchange_tab_RESOURCES_edit_resource_success'),
            data,
          );
        })
        .catch((failure) => {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_tab_RESOURCES_edit_resource_error'),
            failure,
          );
        })
        .finally(() => {
          this.services.navigation.resetAction();
        });
    }

    isValid() {
      const displayNameIsValid = _.isString(this.model.displayName)
        && !_.isEmpty(this.model.displayName)
        && this.model.displayName.length <= 256;
      const capacityIsValid = (
        _.isNumber(this.model.capacity)
        && this.model.capacity >= 0
        && this.model.capacity <= 1024
      );

      return this.model.resourceType != null && displayNameIsValid && capacityIsValid;
    }
  },
);
