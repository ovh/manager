import angular from 'angular';
import debounce from 'lodash/debounce';

import controller from './controller';

export default /* @ngInject */ function ($rootScope, $timeout, $window, matchmedia) {
  return {
    restrict: 'A',
    controller,
    scope: true,
    transclude: true,
    replace: true,
    template: '<div class="responsive-switch"'
      + ' data-ng-class="{'
      + " 'responsive-switch_mobile' : isMobile,"
      + " 'responsive-switch-sidebyside' : responsiveSwitchPageMode === 'sidebyside',"
      + " 'responsive-switch-switch' : responsiveSwitchPageMode === 'switch',"
      + " 'responsive-switch-expand' : responsiveSwitchPageMode === 'sidebyside' && activePageIndex >= 1"
      + ' }"'
      + ' data-ng-transclude>'
      + '</div>',
    link($scope, $element, attr, ctrl) {
      $scope.attr = attr;
      $scope.isMobile = false;
      $scope.activePageIndex = attr.responsiveSwitchActivePageIndex
        ? parseInt(attr.responsiveSwitchActivePageIndex, 10)
        : 0;
      $scope.pageWidth = attr.responsiveSwitchPagesWidth
        ? parseInt(attr.responsiveSwitchPagesWidth, 10)
        : 0;
      const mobileMatchMedia = attr.responsiveSwitchMatchMedia
        || '(max-width: 980px)';
      const forcedMode = attr.responsiveSwitchForceMode;

      /**
       *  Responsivity
       */

      function calculateDisplayMode() {
        $scope.isMobile = matchmedia.is(mobileMatchMedia);
        const availableLeft = $element ? $element[0].getBoundingClientRect().left : 0;
        const availableWidth = $window.innerWidth;

        if ($scope.isMobile) {
          $scope.responsiveSwitchPageMode = 'switch';
        } else if (forcedMode) {
          $scope.responsiveSwitchPageMode = forcedMode;
        } else if (availableLeft + ctrl.getTotalPageWidth() < availableWidth) {
          $scope.responsiveSwitchPageMode = 'sidebyside';
        } else {
          $scope.responsiveSwitchPageMode = 'switch';
        }
      }

      // RESIZE WATCHER
      function initResizeWatcher() {
        const $wdw = angular.element($window);
        const onWindowResize = debounce(() => {
          calculateDisplayMode();
          $scope.$apply();
        }, 99);

        $wdw.on('resize', onWindowResize);

        $scope.$on('$destroy', () => {
          $wdw.off('resize', onWindowResize);
        });
      }

      // WATCHER INITIALIZATION
      // ACTIVE PAGE INDEX WATCHER
      function initActivePageIndexWatcher() {
        $scope.$watch('attr.responsiveSwitchActivePageIndex', (newIndex, oldIndex) => {
          $scope.activePageIndex = oldIndex !== undefined ? parseInt(newIndex, 10) : 0;
          ctrl.setActivePage($scope.activePageIndex);
        });
      }

      /**
       *  INITIALIZATION
       */

      // GLOBAL INITIALIZATION
      function init() {
        initResizeWatcher();
        initActivePageIndexWatcher();

        $timeout(() => {
          calculateDisplayMode();
        }, 99);

        // Expose some functions
        $rootScope.$broadcast('responsive.switch.created', {
          getDisplayMode() { return $scope.responsiveSwitchPageMode; },
          getActivePage() { return $scope.activePageIndex; },
        });
      }

      init();
    },
  };
}
