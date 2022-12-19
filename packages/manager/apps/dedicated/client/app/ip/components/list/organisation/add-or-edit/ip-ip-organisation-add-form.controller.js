export default /* @ngInject */ ($scope, ipFeatureAvailability) => {
  $scope.organisationForm = null;

  $scope.$watch('organisationForm.$valid', () => {
    $scope.formOrganisation.formValid = $scope.organisationForm.$valid;
  });

  $scope.showState = function showState() {
    return ipFeatureAvailability.showState();
  };

  $scope.getClassLabel = function getClassLabel(label, noDirty) {
    if (label && (noDirty || label.$dirty)) {
      return (label.$invalid && 'error') || 'success';
    }
    return '';
  };

  $scope.hasError = function hasError(label) {
    return label.$invalid && label.$dirty;
  };
};
