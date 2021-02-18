import includes from 'lodash/includes';

angular.module('managerApp').directive('cuiPassword', ($compile) => ({
  restrict: 'A',
  // the input will not work if there are more than 1 cui-password in a given scope / controller.
  // Will fix later.
  scope: false,
  replace: true,
  link: ($scope, $element) => {
    $scope.showPassword = false;
    $scope.$watch(
      () => $scope.showPassword,
      () => {
        $element.attr('type', $scope.showPassword ? 'text' : 'password');
      },
    );

    const buttons = angular.element(`
        <button class="oui-button" type="button" aria-label="Show password" data-ng-click="showPassword = !showPassword" data-ng-show="!showPassword">
          <i class="oui-icon oui-icon-eye"></i>
        </button>
        <button class="oui-button" type="button" aria-label="Hide password" data-ng-click="showPassword = !showPassword" data-ng-show="showPassword">
          <i class="oui-icon oui-icon-eye-blocked"></i>
        </button>
      `);
    $compile(buttons)($scope);

    const parent = $element[0].parentElement;
    if (includes(parent.classList, 'oui-input-group')) {
      buttons.appendTo(parent);
    } else if (includes(parent.classList, 'oui-field-control')) {
      const container = angular.element(
        '<div class="oui-input-overlay"></div>',
      );
      container.appendTo(parent);
      $element.appendTo(container);
      buttons.appendTo(container);
    }
  },
}));
