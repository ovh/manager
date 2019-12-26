import set from 'lodash/set';

import template from './input-file.html';

export default () => ({
  restrict: 'E',
  transclude: true,
  scope: {
    ngModel: '=',
    ngAccept: '@',
    ngAcceptFilter: '&',
    change: '&',
    fileExplain: '@',
  },
  template,
  link(scope, element, attrs, controller) {
    // eslint-disable-next-line no-prototype-builtins
    if (attrs.hasOwnProperty('ngAcceptFilter')) {
      set(controller, 'hasNgAcceptFilter', true);
    }
  },
  controller($scope, $element, $timeout) {
    'ngInject';

    $scope.selected = false;
    const self = this;

    const fileInput = $element.find('input');

    $scope.$watch('ngModel', () => {
      if ($scope.ngModel && $scope.ngModel.name && !$scope.selected) {
        $timeout(() => {
          $scope.selected = true;
        });
      } else if (!$scope.ngModel) {
        $timeout(() => {
          $scope.selected = false;
        });
      }
    });

    fileInput.bind('change', () => {
      $timeout(() => {
        const file = fileInput[0].files[0];
        if (
          !self.hasNgAcceptFilter ||
          (file && $scope.ngAcceptFilter({ file }))
        ) {
          $scope.selected = true;
          $timeout(() => {
            $scope.ngModel = file;
          });
        }
        $scope.change({ file });
      });
    });

    $scope.clearFile = function clearFile() {
      $scope.selected = false;
      $timeout(() => {
        $scope.ngModel = null;
        fileInput.val('');
        $scope.change({ file: null });
      });
    };
  },
});
