import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import sliceEmail from '../../filter/slice-email';

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
    this.model = navigation.currentActionData;
    this.model.slicedEmail = sliceEmail(
      this.model.resourceEmailDisplayName,
      20,
    );

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
    const displayNameIsValid =
      isString(this.model.displayName) &&
      !isEmpty(this.model.displayName) &&
      this.model.displayName.length <= 256;
    const capacityIsValid =
      isNumber(this.model.capacity) &&
      this.model.capacity >= 0 &&
      this.model.capacity <= 1024;

    return (
      this.model.resourceType != null && displayNameIsValid && capacityIsValid
    );
  }
}
