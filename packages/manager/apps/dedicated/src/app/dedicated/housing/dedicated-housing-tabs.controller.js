angular.module('App').controller('HousingTabsCtrl', [
  '$scope',
  '$stateParams',
  '$location',

  function ($scope, $stateParams, $location) {
    $scope.toKebabCase = _.kebabCase;
    const defaultTab = 'dashboard';
    $scope.tabs = ['dashboard', 'backup', 'task'];

    $scope.isActive = tab => ($scope.selectedTab === tab ? 'active' : '');

    $scope.setSelectedTab = (tab) => {
      if (tab !== undefined && tab !== null && tab !== '') {
        $scope.selectedTab = tab;
      } else {
        $scope.selectedTab = defaultTab;
      }
      $location.search('tab', $scope.selectedTab);
    };

    if ($stateParams.tab && ~$scope.tabs.indexOf($stateParams.tab)) {
      $scope.setSelectedTab($stateParams.tab);
    } else {
      $scope.setSelectedTab(defaultTab);
    }
  },
]);
