import $ from 'jquery';

export default /* @ngInject */ ($timeout) => ({
  restrict: 'A',
  scope: {
    wucOvhFilereaderAction: '&',
    wucOvhFilereaderReplace: '=?',
    ovhDisableReader: '=?',
    ngModel: '=',
  },
  link: ($scope, element) => {
    $(element).addClass('ovh-filereader');

    function onLoadEvent(event) {
      $scope.$apply(() => {
        const result = event.target.result
          ? event.target.result.replace(/[,;]/g, ' ').trim()
          : '';

        if ($scope.ovhDisableReader) {
          [$scope.ngModel] = element[0].files;
        } else {
          $scope.ngModel += ($scope.ngModel.length ? ' ' : '') + result;
        }

        if ($scope.wucOvhFilereaderAction) {
          $timeout(() => {
            $scope.wucOvhFilereaderAction();
          }, 0);
        }
      });
    }

    element.on('change', (onChangeEvent) => {
      if ($scope.wucOvhFilereaderReplace || !$scope.wucOvhFilereader) {
        $scope.wucOvhFilereader = '';
      }

      const reader = new FileReader();
      reader.onload = onLoadEvent;

      if ((onChangeEvent.srcElement || onChangeEvent.target).files[0]) {
        reader.readAsText(
          (onChangeEvent.srcElement || onChangeEvent.target).files[0],
        );
      } else {
        $scope.ngModel = '';
      }
    });

    $scope.$watch('ngModel', () => {
      if ($scope.ngModel === null) {
        element.val(null);
      }
    });
  },
});
