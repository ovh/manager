export default /* @ngInject */ ($scope, coreURLBuilder) => {
  $scope.data = $scope.currentActionData;
  $scope.serviceLink = coreURLBuilder.buildURL(
    'dedicated',
    '#/billing/autorenew',
  );
  $scope.cancelAction = () => {
    $scope.resetAction();
  };
};
