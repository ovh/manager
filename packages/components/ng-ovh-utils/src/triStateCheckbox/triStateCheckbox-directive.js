/**
 * @ngdoc directive
 * @name ovhDirectives.directive:triStateCheckbox
 * @element ANY
 *
 * @decription
 * The directive tracks the array of selected element and update automatically its state.
 *
 * State:
 *   - 0 : Nothing selected
 *   - 1 : Partial elements selected
 *   - 2 : All elements selected
 *
 * @version 1.0.1
 *
 * @example
 * <code:html>
 *
 *     <input type="checkbox"
 *            data-tri-state-checkbox="id"        <!-- (ID is optional) -->
 *            data-tsc-ids-all="arrayFull"        <!-- Array with all IDs -->
 *            data-tsc-ids-selected="arraySel"    <!-- Array with IDs selected -->
 *            data-tsc-on-click="foo(newState)"
 *            <!-- Parent scope function called when user click on the checkbox -->
 *     />
 *
 * </code>
 *
 * @info
 * The checkbox update its state AUTOMATICALLY when the array of selected IDs is updated.
 * If the user click on the checkbox, it call a function with the new state in param.
 * With this, you can update your array/view!
 */
import angular from 'angular';

export default /* @ngInject */ function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      idsAll: '=tscIdsAll',
      idsSelected: '=tscIdsSelected',
      onClick: '&tscOnClick',
    },
    link($scope, el) {
      let initialized = false;

      $scope.state = 0;

      function setStateTo(nbr) {
        if (!initialized) {
          return;
        }
        $scope.state = nbr;
        $timeout(() => {
          el.prop({
            checked: nbr === 2,
            indeterminate: nbr === 1,
          });
        });
      }

      function autoUpdateState() {
        if ($scope.idsAll.length && $scope.idsAll.length === $scope.idsSelected.length) {
          setStateTo(2);
        } else if ($scope.idsAll.length && $scope.idsSelected.length > 0) {
          setStateTo(1);
        } else {
          setStateTo(0);
        }
      }

      function init() {
        $scope.$watch('idsAll.length', () => {
          autoUpdateState();
        });
        $scope.$watch('idsSelected.length', () => {
          autoUpdateState();
        });
        initialized = true;
      }

      $scope.$watch('idsAll', () => {
        if (!initialized && angular.isArray($scope.idsAll) && $scope.idsAll.length) {
          init();
        }
      });

      // @todo test touch
      el.bind('click touchend', (e) => {
        e.preventDefault();
        if ($scope.state === 2) {
          setStateTo(0);
        } else {
          setStateTo($scope.state + 1);
        }
        $scope.onClick({ state: $scope.state });
      });
    },
  };
}
