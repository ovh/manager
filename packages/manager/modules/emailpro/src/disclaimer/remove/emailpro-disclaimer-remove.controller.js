export default /* @ngInject */ ($scope, $stateParams, $translate, EmailPro) => {
  $scope.disclaimer = $scope.currentActionData;
  $scope.submit = function submit() {
    $scope.setMessage($translate.instant('emailpro_dashboard_action_doing'), {
      status: 'success',
    });
    EmailPro.deleteDisclaimer(
      $stateParams.productId,
      $scope.disclaimer.domain.name,
    ).then(
      () => {
        $scope.setMessage(
          $translate.instant('emailpro_ACTION_delete_disclaimer_success'),
          { status: 'success' },
        );
      },
      (failure) => {
        $scope.setMessage(
          $translate.instant('emailpro_ACTION_delete_disclaimer_failure'),
          failure.data,
        );
      },
    );
    $scope.resetAction();
  };
};
