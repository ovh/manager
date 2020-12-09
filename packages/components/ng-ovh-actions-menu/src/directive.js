/**
 *  @ngdoc directive
 *
 *  @name actionsMenu.directive:actionsMenu
 *
 *  @description
 *  This is the main directive of the module. It's creating a popover with desired actions inside.
 *
 *  @param {Object[]} actions-menu-options A list of actions options that will be displayed into
 *  actionsMenu. See ActionsMenu factory and ActionsMenuItem factory for available options.
 *  @param {Object} actions-menu-popover-settings A list of options of the popover.
 *  For now only : class, placement, trigger and isOpen options are supported.
 *  Feel free to add others!
 See [ui.bootstrap.popover](https://angular-ui.github.io/bootstrap/#/popover) for more informations.
 *
 *  @example
 *  The following example will open an actions popover with 2 actions inside it:
 *
 *  In your controller:
 *
 *  <pre>
 *  angular.module("myManagerModule").controller("myTestController", function ($scope) {
 *      $scope.popoverSettings = {
 *          "popover-class": "my-custom-class",
 *          "popover-placement": "bottom-right"
 *      };
 *
 *      $scope.actionsOptions = [{
 *          title: "My Beautiful title",
 *          icon: "filled-check",
 *          href: "http://www.google.be"
 *      }, {
 *          title: "My Other title",
 *          icon: "filled-error",
 *          state: "my-manager.state1"
 *      }];
 *  });
 *  </pre>
 *
 *  And in your html view:
 *
 *  <pre>
 *  <actions-menu data-actions-menu-options="actionsOptions"
 *                data-actions-menu-popover-settings="popoverSettings">
 *      <i class="my-font my-font-actions"></i>
 *      Button actions
 *  </actions-menu>
 *  </pre>
 */

import template from './template.html';
import controller from './controller';

export default function () {
  return {
    restrict: 'E',
    transclude: true,
    template,
    scope: {
      actionsOptions: '=actionsMenuOptions',
      popoverSettings: '=actionsMenuPopoverSettings',
    },
    controller,
    controllerAs: '$ctrl',
    bindToController: true,
    link(scope, tElement, attributs, actionsMenuCtrlParam) {
      const actionsMenuCtrl = actionsMenuCtrlParam;

      /**
       *  Close actions menu popover
       */
      const closeActionsMenu = function closeActionsMenu() {
        actionsMenuCtrl.popoverSettings.isOpen = false;
        scope.$apply();
      };

      /**
       *  Watch isOpen state to force left page to be displayed in case of reopening actions menu
       */
      scope.$watch('$ctrl.popoverSettings.isOpen', (isNowOpen, wasOpen) => {
        if (wasOpen && !isNowOpen) {
          actionsMenuCtrl.status.move = false;
        } else if (isNowOpen && !wasOpen) {
          actionsMenuCtrl.onPageSwitch();
        }
      });

      /**
       *  Manage escape event on actions button element
       */
      tElement.find('button.actions-menu-button').on('keydown', (event) => {
        if (event.keyCode === 27) {
          closeActionsMenu();
        }
      });

      /**
       *  Manage focus state. Shared with controller to allow focus management into
       *  controller events.
       */
      actionsMenuCtrl.onPageSwitch = function onPageSwitch() {
        // get visible page dom element
        const visiblePage = tElement.find(
          actionsMenuCtrl.status.move ? 'div.secondary-page' : 'div.main-page',
        );

        // insert a invisible link to it for a better focus management
        let focusHelper = visiblePage.find('a.focus-helper');
        if (!focusHelper.length) {
          focusHelper = $('<a></a>');
          focusHelper.attr({
            href: '#',
            class: 'focus-helper',
            onClick: 'return false;',
          });
          visiblePage.append(focusHelper);
        }

        // set focus to invisble element
        focusHelper.focus();

        // manage focus loop for current page
        visiblePage.on('keydown', (event) => {
          if (event.keyCode === 9) {
            // tab
            if (event.shiftKey) {
              // shift+tab
              if (
                $(event.target).is(
                  visiblePage.find('a:not(.focus-helper), button').first(),
                )
              ) {
                visiblePage.find('a:not(.focus-helper), button').last().focus();
                event.preventDefault();
              }
            } else if (
              $(event.target).is(
                visiblePage.find('a:not(.focus-helper), button').last(),
              ) ||
              $(event.target).is(focusHelper)
            ) {
              visiblePage.find('a:not(.focus-helper), button').first().focus();
              event.preventDefault();
            }
          } else if (event.keyCode === 27) {
            // esc
            closeActionsMenu();
          }
        });
      };
    },
  };
}
