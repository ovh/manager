import controller from './controller';
import template from './template.html';

export default function () {
  return {
    restrict: 'A',
    scope: false,
    transclude: true,
    controller,
    replace: true,
    template,
    link($scope, $element, $attrs, ctrlParam) {
      let modal;
      const ctrl = ctrlParam;

      ctrl.show = function show() {
        if (!modal) {
          modal = $('#currentAction').modal({
            backdrop: 'static',
          });
        } else {
          modal.modal('show');
        }
      };

      ctrl.hide = function hide() {
        if (modal) {
          modal.modal('hide');
        }
      };
    },
  };
}
