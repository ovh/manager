import template from './otrs-popup.html';
import './otrs-popup.less';

export default function () {
  return {
    restrict: 'A',
    scope: {},
    replace: false,
    template,
    link: ($scope, $element) => {
      $scope.status = {
        minimize: false,
        maximize: false,
        close: true,
      };

      $scope.minimize = () => {
        $scope.status.maximize = false;
        $scope.status.minimize = true;
        $scope.status.close = false;
      };

      $scope.maximize = () => {
        $scope.status.maximize = true;
        $scope.status.minimize = false;
        $scope.status.close = false;
      };

      $scope.restore = () => {
        $scope.status.maximize = false;
        $scope.status.minimize = false;
        $scope.status.close = false;
      };

      $scope.toggle = () => {
        if ($scope.status.maximize || $scope.status.minimize) {
          $scope.restore();
        } else {
          $scope.maximize();
        }
      };

      $scope.open = () => {
        $scope.restore();
        $scope.status.close = false;
      };

      $scope.close = () => {
        $scope.restore();
        $scope.status.close = true;
      };

      $scope.$on('otrs.popup.maximize', $scope.maximize);
      $scope.$on('otrs.popup.minimize', $scope.minimize);
      $scope.$on('otrs.popup.restore', $scope.restore);
      $scope.$on('otrs.popup.toggle', $scope.toggle);
      $scope.$on('otrs.popup.open', $scope.open);
      $scope.$on('otrs.popup.close', $scope.close);

      $element.children('.otrs-popup.draggable').one('drag', (event, ui) => {
        ui.helper.removeClass('otrs-popup-initial');
      });
    },
  };
}
