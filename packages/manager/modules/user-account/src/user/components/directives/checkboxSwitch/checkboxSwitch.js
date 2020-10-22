/* eslint-disable no-shadow */
angular.module('UserAccount').directive('checkboxSwitch', [
  '$timeout',
  function checkboxSwitchDirective($timeout) {
    return {
      template:
        '<div class="has-switch" data-ng-class="{ deactivate: ngDisabled }">' +
        '<div class="switch-wrapper switch-animate" data-ng-class="{ \'switch-on\': ngModel, \'switch-off\': !ngModel }">' +
        '<input type="checkbox" data-ng-model="ngModel" />' +
        '<span class="switch-left" data-ng-click="changeStatusTo(false)">{{switchOnLabel}}</span>' +
        '<label>&nbsp;</label>' +
        '<span class="switch-right" data-ng-click="changeStatusTo(true)">{{switchOffLabel}}</span>' +
        '</div>' +
        '</div>',
      restrict: 'A',
      require: '?ngModel',
      replace: true,
      scope: {
        ngModel: '=',
        ngDisabled: '=',
        switchOnLabel: '@cbSwitchOnLabel',
        switchOffLabel: '@cbSwitchOffLabel',
        switchOnChange: '&cbSwitchOnChange',
      },
      link: function postLink($scope, el) {
        const elCursor = el.find('label');
        const elWrapper = el.find('.switch-wrapper');

        $scope.changeStatusTo = function changeStatusTo(state) {
          if (!$scope.ngDisabled && state !== $scope.ngModel) {
            $timeout(() => {
              $scope.ngModel = state;
              $scope.switchOnChange({ state });
            });
          }
        };

        elCursor.bind('mousedown touchstart', (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();

          if ($scope.ngDisabled) {
            return;
          }

          $scope.moving = false;
          elWrapper.removeClass('switch-animate');

          elCursor.bind('mousemove touchmove', (e) => {
            const relativeX =
              (e.pageX || e.originalEvent.targetTouches[0].pageX) -
              el.offset().left;
            let percent = (relativeX / el.width()) * 100;
            const left = 25;
            const right = 75;

            $scope.moving = true;
            if (percent < left) {
              percent = left;
            } else if (percent > right) {
              percent = right;
            }
            elWrapper.css('left', `${percent - right}%`);
          });

          elCursor.on('mouseleave', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            elCursor.unbind('mouseleave mousemove touchmove mouseup touchend');

            if ($scope.moving) {
              $scope.changeStatusTo(parseInt(elWrapper.css('left'), 10) >= -25);
            }

            elWrapper.addClass('switch-animate');
            elWrapper.css('left', '');
          });

          elCursor.on('mouseup touchend', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            elCursor.trigger('mouseleave');
          });
        });

        elCursor.bind('click', (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();

          if (!$scope.moving) {
            $scope.changeStatusTo(!$scope.ngModel);
          }
        });
      },
    };
  },
]);
/* eslint-enable no-shadow */
