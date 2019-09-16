angular.module('managerApp').controller('RA.storage.addObject',
  ($scope, $uibModalInstance) => {
    $scope.form = {
      prefix: '/',
    };

    $scope.uploadForm = {
      files: undefined,
      folder: undefined,
    };

    $scope.loaders = {
      uploading: false,
    };

    $scope.$watch('uploadForm.files', (nv, old) => {
      if (old === null && nv !== null) {
        // when the prefix does not with a / it simply append the prefix to the file name.
        if (!_.endsWith($scope.form.prefix, '/')) {
          $scope.form.prefix += '/';
        }

        $uibModalInstance.close({
          files: $scope.uploadForm.files,
          prefix: $scope.form.prefix,
        });
      }
    });

    $scope.cancel = function cancel() {
      $uibModalInstance.dismiss();
    };
  });
