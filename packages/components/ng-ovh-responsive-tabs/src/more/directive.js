import template from './template.html';

export default /* @ngInject */ ($state) => ({
  restrict: 'AE',
  require: '^responsiveTabs',
  replace: true,
  transclude: true,
  template,
  scope: {},
  compile() {
    return ($scope, elm, attrs, tabsetCtrl) => {
      $scope.$tab = $(elm);

      $scope.tabs = tabsetCtrl.tabs;

      // When select a tab in the dropdown, the "active" var switch to true,
      // so it trigger the $watch('active') from the original tab.
      $scope.select = (selectedTab) => {
        if (!selectedTab.disabled) {
          $state.go(selectedTab.state, selectedTab.stateParams, selectedTab.stateOptions);
          tabsetCtrl.select(selectedTab);
        }
      };

      tabsetCtrl.addTabMore($scope);
    };
  },
});
