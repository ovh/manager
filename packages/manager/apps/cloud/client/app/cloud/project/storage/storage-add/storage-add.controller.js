angular
  .module('managerApp')
  .controller(
    'RA.storageAddCtrl',
    ($scope, $stateParams, $translate, ovhDocUrl) => {
      $scope.projectId = $stateParams.projectId;

      // guides
      $scope.guides = {
        title: $translate.instant('storage_details_guide_title'),
        list: [
          {
            name: $translate.instant('storage_details_guide_pca'),
            url: ovhDocUrl.getDocUrl('cloud/storage/pca'),
          },
          {
            name: $translate.instant('storage_details_guide_pcs'),
            url: ovhDocUrl.getDocUrl('cloud/storage/pcs'),
          },
        ],
        footer: $translate.instant('storage_details_guide_footer'),
      };

      $scope.addedType = {
        value: 'storage',
      };

      $scope.contentTitle = `${$translate.instant(
        'add_title',
      )} ${$translate.instant('add_storage').toLowerCase()}`;

      $scope.$on('reload-add', () => {
        $scope.init();
      });
    },
  );
