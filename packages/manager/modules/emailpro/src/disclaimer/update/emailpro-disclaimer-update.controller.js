import angular from 'angular';
import head from 'lodash/head';

export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  function loadOptions() {
    $scope.loadingData = true;
    return EmailPro.getUpdateDisclaimerOptions()
      .then((data) => {
        $scope.availableAttributes = data.availableAttributes;
        if (data.availableAttributes) {
          $scope.data.selectedAttribute = head(data.availableAttributes);
        }
        return $scope.data;
      })
      .then((data) => {
        $scope.loadingData = false;
        return data;
      });
  }

  $scope.data = angular.copy($scope.currentActionData);

  loadOptions();

  $scope.getCompleteDomain = function getCompleteDomain(domainName) {
    let result;
    angular.forEach($scope.availableDomains, (value) => {
      if (value.name === domainName) {
        result = value;
      }
    });
    return result;
  };

  /**
   * Insert attributes at text field current cursor position
   */
  $scope.insertAttribute = function insertAttribute() {
    $scope.data.content += `%%${$scope.data.selectedAttribute}%%`;
  };

  $scope.saveDisclaimer = function saveDisclaimer() {
    const model = {
      domain: $scope.data.domain.name,
      externalEmailsOnly: $scope.data.outsideOnly,
      content: $scope.data.content,
    };

    $scope.setMessage($translate.instant('emailpro_dashboard_action_doing'));
    EmailPro.updateDisclaimer($stateParams.productId, model).then(
      () => {
        $scope.setMessage(
          $translate.instant(
            'emailpro_ACTION_update_disclaimer_success_message',
          ),
          { status: 'success' },
        );
      },
      (failure) => {
        $scope.setMessage(
          $translate.instant('emailpro_ACTION_update_disclaimer_error_message'),
          failure.data,
        );
      },
    );
    $scope.resetAction();
  };
};
