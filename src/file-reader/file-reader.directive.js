import angular from 'angular';

import template from './file-reader.html';

export default () => ({
  restrict: 'E',
  transclude: true,
  bindToController: true,
  scope: {
    ngAccept: '@',
    ngAcceptFilter: '&',
    ngRead: '&',
  },
  template,
  controller($element, $attrs, $window, $timeout) {
    'ngInject';

    const fileInput = $element.find('input');
    const self = this;

    self.hasFileReader = angular.isDefined($window.FileReader);

    if (self.hasFileReader) {
      fileInput.bind('change', () => {
        const file = fileInput[0].files[0];
        fileInput[0].value = null; // reset

        if (file) {
          let isAcceptedFile = true;

          if (angular.isDefined($attrs.ngAcceptFilter)) {
            isAcceptedFile = self.ngAcceptFilter({ file });
          }

          if (isAcceptedFile) {
            const reader = new $window.FileReader();
            reader.onload = function () {
              $timeout(() => {
                if (angular.isDefined($attrs.ngRead)) {
                  self.ngRead({ data: reader.result });
                }
              });
            };
            reader.readAsText(file);
          }
        }
      });
    }
  },
  controllerAs: 'ctrl',
});
