import angular from 'angular';

export default class ExchangeToolboxSharedCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    messaging,
    navigation,
    $translate,
    exchangeStates,
  ) {
    this.services = {
      $scope,
      wucExchange,
      messaging,
      navigation,
      $translate,
      exchangeStates,
    };
  }

  updateShared(shared) {
    if (this.services.exchangeStates.constructor.isOk(shared)) {
      this.services.navigation.setAction(
        'exchange/shared/update/shared-update',
        angular.copy(shared),
      );
    }
  }

  removeShared(shared) {
    if (
      this.services.exchangeStates.constructor.isOk(shared) &&
      !shared.hasChildren
    ) {
      this.services.navigation.setAction(
        'exchange/shared/remove/shared-remove',
        angular.copy(shared),
      );
    }
  }

  sharedPermissions(shared) {
    if (this.services.exchangeStates.constructor.isOk(shared)) {
      this.services.navigation.setAction(
        'exchange/shared/permission/update/shared-permission-update',
        angular.copy(shared),
      );
    }
  }
}
