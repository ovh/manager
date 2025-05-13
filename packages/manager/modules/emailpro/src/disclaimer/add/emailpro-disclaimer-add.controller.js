import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  $scope.data = {
    content: '',
    outsideOnly: false,
    selectedVariable: 'Name',
  };

  $scope.insertVariable = function insertVariable() {
    this.data.content += `%%${this.data.selectedAttribute}%%`;
  };

  $scope.loadAvailableDomains = function loadAvailableDomains() {
    $scope.loadingData = true;

    return EmailPro.getNewDisclaimerOptions($stateParams.productId).then(
      (data) => {
        $scope.loadingData = false;
        if (data.availableDomains) {
          $scope.availableDomains = data.availableDomains;
          $scope.selectCurrentDomain();

          $scope.data.selectedAttribute = head(data.availableAttributes);
          $scope.availableAttributes = data.availableAttributes;
        } else {
          $scope.resetAction();
          $scope.setMessage(
            $translate.instant('emailpro_ACTION_add_disclaimer_no_domains'),
          );
        }
        return $scope.data;
      },
    );
  };

  $scope.selectCurrentDomain = function selectCurrentDomain() {
    if (get($scope, 'currentActionData.domain.name')) {
      $scope.data.completeDomain = find($scope.availableDomains, {
        name: $scope.currentActionData.domain.name,
      });
    }
    if (!$scope.data.completeDomain) {
      $scope.data.completeDomain = head($scope.availableDomains);
    }
  };

  $scope.loadAvailableDomains();

  $scope.saveDisclaimer = function saveDisclaimer() {
    const model = {
      domain: $scope.data.completeDomain.name,
      externalEmailsOnly: $scope.data.outsideOnly,
      content: $scope.data.content,
    };

    $scope.setMessage($translate.instant('emailpro_dashboard_action_doing'), {
      status: 'success',
    });
    EmailPro.saveDisclaimer($stateParams.productId, model).then(
      () => {
        $scope.setMessage(
          $translate.instant('emailpro_ACTION_add_disclaimer_success_message'),
          { status: 'success' },
        );
      },
      (failure) => {
        $scope.setMessage(
          $translate.instant('emailpro_ACTION_add_disclaimer_error_message'),
          failure.data,
        );
      },
    );
    $scope.resetAction();
  };
};
