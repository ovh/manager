export default ($scope, IpByoipService) => {
  /* @ngInject */
  $scope.ip = $scope.currentActionData.ipBlock;
  $scope.ipSizes = [];
  $scope.selectedSize = {};
  $scope.isLoaded = false;
  $scope.errorMessage = null;

  IpByoipService.getAvailableSlicingConfigurations($scope.ip.ipBlock)
    .then((response) => {
      $scope.ipSizes = response.data;
      if ($scope.ipSizes.length) {
        $scope.selectedSize = $scope.ipSizes[0];
      }
      $scope.isLoaded = true;
    })
    .catch((error) => {
      $scope.errorMessage = error.data.message;
    })
    .finally(() => {
      $scope.isLoaded = true;
    });

  $scope.cancelSlice = () => {
    $scope.resetAction();
  };

  $scope.slice = () => {
    $scope.isLoaded = false;
    IpByoipService.postSliceBOYIP(
      $scope.ip.ipBlock,
      $scope.selectedSize.slicingSize,
    )
      .then(() => {
        $scope.resetAction();
      })
      .catch((error) => {
        $scope.errorMessage = error.data.message;
      })
      .finally(() => {
        $scope.isLoaded = true;
      });
  };
};
