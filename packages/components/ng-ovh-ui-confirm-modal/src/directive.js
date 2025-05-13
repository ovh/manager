/**
 * @ngdoc directive
 * @name ng-ovh-ui-confirm-modal.directive:ngReallyClick
 * @scope
 * @restrict EA
 * @description
 *
 * Implement confirmation modal
 *
 * To use ng-ovh-ui-confirm-modal, you have to inject ngOvhUiConfirmModal as dependency
 * and use it like below example
 * <pre>
 *  angular.module('myApp', ['ngOvhUiConfirmModal']);
 * </pre>
 *
 *
 */

export default /* @ngInject */ function($uibModal) {
  return {
    restrict: 'EA',
    link(scope, element, attrs) {
      const confirmButton = attrs.ngReallyConfirm || 'OK';
      const cancelButton = attrs.ngReallyCancel || 'Cancel';

      element.click(() => {
        const clickAction = attrs.ngReallyClick;
        const clickUndo = attrs.ngReallyUndo;

        let template = attrs.ngReallyTitle
          ? `<div class="modal-header">${attrs.ngReallyTitle}</div>`
          : '';
        template +=
          `<div class="modal-body">${attrs.ngReallyMessage}</div>` +
          '<div class="modal-footer">' +
          `<button type="button" class="btn btn-primary" ng-click="$close('ok')">${confirmButton}</button>` +
          `<button type="button" class="btn btn-default btn-cancel" ng-click="$dismiss('cancel')">${cancelButton}</button>` +
          '</div>';

        $uibModal
          .open({
            template,
            windowClass: attrs.ngReallyWindowClass,
          })
          .result.then(
            () => {
              scope.$eval(clickAction);
            },
            () => {
              if (clickUndo) {
                scope.$eval(clickUndo);
              }
            },
          );
      });
    },
  };
}
