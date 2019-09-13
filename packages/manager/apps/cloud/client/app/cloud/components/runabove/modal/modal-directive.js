angular.module('managerApp').directive('raModal',
  [function () {
    return {
      restrict: 'A',
      scope: false,
      transclude: true,
      controller: 'RA.modalCtrl',
      replace: true,
      templateUrl: 'components/modal/modal.html',
      link($scope, $element, $attrs, ctrlParam) {
        let modal;
        const ctrl = ctrlParam;

        ctrl.show = function () {
          if (!modal) {
            modal = $('#currentAction').modal({
              backdrop: 'static',
            });
          } else {
            modal.modal('show');
          }
        };

        ctrl.hide = function () {
          if (modal) {
            modal.modal('hide');
          }
        };
      },
    };
  }]);
