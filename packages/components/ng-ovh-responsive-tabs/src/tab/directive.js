import angular from 'angular';

import template from './template.html';
import templateDropdown from './template-dropdown.html';
import templateUrl from './template-url.html';

export default /* @ngInject */ ($parse, $state) => ({
  restrict: 'AE',
  require: '^responsiveTabs',
  replace: true,
  transclude: true,
  template: (elm, attrs) => {
    if (angular.isDefined(attrs.dropdown)) {
      return templateDropdown;
    } if (angular.isDefined(attrs.url)) {
      return templateUrl;
    }
    return template;
  },
  scope: {
    // "disabled" is below
    onSelect: '&select',
    state: '@',
    stateParams: '@',
    stateOptions: '@',
    dropdownTitle: '@',
    dropdownTitleTemplate: '@',
    url: '@',
    target: '@',
  },
  compile() {
    return ($scope, elm, attrs, tabsetCtrl) => {
      $scope.$tab = $(elm);

      $scope.hidden = false;

      if ($scope.state) {
        $scope.stateParams = $scope.stateParams || {};
        $scope.stateOptions = $scope.stateOptions || {};
        if ($state.includes($scope.state, $scope.stateParams, $scope.stateOptions)) {
          // when responsive-tab wasn't in the DOM (ng-if)
          tabsetCtrl.select($scope);
        }
      } else if ($scope.url) {
        $scope.target = '_self';
      }

      // If no params, take the brutal html inside original tab, for the dropdown.
      if (!$scope.dropdownTitle && !$scope.dropdownTitleTemplate) {
        $scope.title = $scope.$tab.find('> a').html();
      }

      // When user select a tab, "active" switch to true,
      // and trigger the $watch('active'), which select into the ctrl and do the magic.
      $scope.select = () => {
        if (!$scope.disabled) {
          $state.go($scope.state, $scope.stateParams, $scope.stateOptions);
          tabsetCtrl.select($scope);
        }
      };

      $scope.disabled = false;
      if (attrs.disabled) {
        $scope.$parent.$watch($parse(attrs.disabled), (value) => {
          $scope.disabled = !!value;
        });
      }

      tabsetCtrl.addTab($scope);

      // Say to ctrl to remove it
      $scope.$on('$destroy', () => {
        tabsetCtrl.removeTab($scope);
      });
    };
  },
});
