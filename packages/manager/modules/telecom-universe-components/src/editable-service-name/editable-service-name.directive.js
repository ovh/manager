import template from './editable-service-name.html';

export default /* @ngInject */ ($timeout) => ({
  restrict: 'E',
  template,
  scope: {
    title: '<tucEditableServiceNameTitle',
    serviceName: '=tucEditableServiceNameServiceName',
    onEditStart: '&?tucEditableServiceNameTitleOnEditStart',
    onEditCancel: '&?tucEditableServiceNameTitleOnEditCancel',
    onSave: '&tucEditableServiceNameTitleOnSave', // MUST BE a promise
    maxlength: '@',
    disabled: '=',
  },
  bindToController: true,
  controllerAs: '$ctrl',
  controller: 'tucEditableServiceNameCtrl',
  link($scope, $element, attributes, tucEditableServiceNameCtrl) {
    $scope.$watch('$ctrl.inEdition', (isInEdition) => {
      if (isInEdition) {
        $timeout(() => {
          $element.find('input.service-name-edit-input').select();
        });
      }
    });

    $element.on('keydown blur', 'input.service-name-edit-input', (event) => {
      if (event.type === 'keydown') {
        if (event.keyCode === 27) {
          // if ESC is pressed
          tucEditableServiceNameCtrl.cancelEdition();
          $scope.$apply();
        }
      }
    });

    $scope.$on('$destroy', () => {
      $element.off('keydown');
    });
  },
});
