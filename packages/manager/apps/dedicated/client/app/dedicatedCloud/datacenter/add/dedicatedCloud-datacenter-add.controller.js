angular
  .module('App')
  .controller(
    'DedicatedCloudDatacentersAddCtrl',
    (
      $scope,
      $stateParams,
      $translate,
      DedicatedCloud,
      COMMERCIAL_RANGE_ENUM,
    ) => {
      $scope.loader = false;

      $scope.commercialRange = {
        list: [],
        model: null,
        constants: COMMERCIAL_RANGE_ENUM,
      };

      $scope.load = function load() {
        $scope.loader = true;

        DedicatedCloud.getCommercialRangeList($stateParams.productId)
          .then(
            (list) => {
              $scope.commercialRange.list = list;
            },
            (data) => {
              $scope.resetAction();
              $scope.setMessage(
                $translate.instant(
                  'dedicatedCloud_datacenters_adding_load_error',
                ),
                angular.extend(data, { type: 'ERROR' }),
              );
            },
          )
          .finally(() => {
            $scope.loader = false;
          });
      };

      $scope.addDatacenter = function addDatacenter() {
        $scope.resetAction();
        DedicatedCloud.addDatacenter(
          $stateParams.productId,
          $scope.commercialRange.model,
        ).then(
          () => {
            $scope.setMessage(
              $translate.instant('dedicatedCloud_datacenters_adding_success'),
              true,
            );
          },
          (data) => {
            $scope.setMessage(
              $translate.instant('dedicatedCloud_datacenters_adding_error'),
              angular.extend(data, { type: 'ERROR' }),
            );
          },
        );
      };
    },
  );
