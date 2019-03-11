import Draggable from 'draggable';

import controller from './otrs-popup.controller';
import template from './otrs-popup.html';
import './otrs-popup.less';

export default function () {
  return {
    restrict: 'A',
    scope: {},
    replace: false,
    controller,
    controllerAs: 'OtrsPopupCtrl',
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

      const maximizeWatch = $scope.$watch('status.maximize', () => (
        $scope.status.maximize
          ? $element.addClass('maximize')
          : $element.removeClass('maximize')));

      const minimizeWatch = $scope.$watch('status.minimize', () => (
        $scope.status.minimize
          ? $element.addClass('minimize')
          : $element.removeClass('minimize')));

      const closeWatch = $scope.$watch('status.close', () => (
        $scope.status.close
          ? $element.addClass('close')
          : $element.removeClass('close')));

      $element.addClass('otrs-container');
      $element.addClass('initial-setting');

      const dragData = {};
      new Draggable($element[0], { // eslint-disable-line
        handle: $element.find('#draggableTitle')[0],
        onDragStart: (element) => {
          // actualStartPosition is a fix to work-around
          // the wrong initial height of the pop-up. we
          // only need it in the first drag operation
          delete dragData.actualStartPosition;
          if (element.classList.contains('initial-setting')) {
            const boundingBox = element.getBoundingClientRect();
            dragData.actualStartPosition = { x: boundingBox.left, y: boundingBox.top };
            element.classList.remove('initial-setting');
          }
        },
        limit: (currX, currY, x0, y0) => {
          const position = (dragData.actualStartPosition
            ? { x: currX, y: currY - (y0 - dragData.actualStartPosition.y) }
            : { x: currX, y: currY });
          // Prevent pop-up to be dragged above the window
          position.y = position.y < 0 ? 0 : position.y;
          return position;
        },
      });

      $scope.$on('$destroy', () => {
        maximizeWatch();
        minimizeWatch();
        closeWatch();
      });
    },
  };
}
