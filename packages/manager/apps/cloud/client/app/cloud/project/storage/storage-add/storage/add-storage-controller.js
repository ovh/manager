import isUndefined from 'lodash/isUndefined';

angular.module('managerApp').controller('RA.add.storageCtrl', [
  '$q',
  '$scope',
  '$state',
  '$stateParams',
  '$timeout',
  '$translate',
  'OvhApiCloudProjectRegion',
  'CloudStorageContainers',
  'CucCloudMessage',
  'CucControllerHelper',
  'CucServiceHelper',
  function storageCtrl(
    $q,
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    OvhApiCloudProjectRegion,
    CloudStorageContainers,
    CucCloudMessage,
    CucControllerHelper,
    CucServiceHelper,
  ) {
    $scope.projectId = $stateParams.projectId;

    $scope.model = {};
    $scope.steps = {
      region: {
        enable: false,
      },
      containerType: {
        enable: false,
      },
      name: {
        enable: false,
      },
    };

    $scope.stepPath = null;

    $scope.loaders = {
      regions: true,
    };

    $scope.historyStep = [];

    // handle messages
    $scope.messages = [];

    function refreshMessage() {
      $scope.messages = $scope.messageHandler.getMessages();
    }

    function loadMessage() {
      CucCloudMessage.unSubscribe('iaas.pci-project.compute.storage');
      $scope.messageHandler = CucCloudMessage.subscribe(
        'iaas.pci-project.compute.storage',
        { onMessage: () => refreshMessage() },
      );
    }

    $scope.loadStep = function loadStep(step) {
      $scope.steps[step].enable = true;
      $scope.historyStep.push(step);
    };

    $scope.isValid = function isValid() {
      const isDefined = function isDefined(expr) {
        return !isUndefined(expr);
      };
      return (
        isDefined($scope.model.region) &&
        isDefined($scope.model.containerType) &&
        isDefined($scope.model.name)
      );
    };

    $scope.addStorage = function addStorage() {
      $scope.loaders.post = true;

      return CloudStorageContainers.create(
        $scope.projectId,
        $scope.model.name,
        $scope.model.region,
        $scope.model.containerType.type,
      )
        .then((resp) => {
          if (!resp || !resp.id) {
            CucCloudMessage.error(
              $translate.instant('add_storage_storage_added_error'),
            );
            return $q.reject(resp);
          }

          return $timeout(() => {
            CucCloudMessage.success(
              $translate.instant('add_storage_storage_added'),
            );
            $state.go('iaas.pci-project.compute.storage.detail-container', {
              projectId: $scope.projectId,
              storageId: resp.id,
            });
          }, 3000).then(() => resp);
        })
        .finally(() => {
          $scope.loaders.post = false;
        });
    };

    function loadRegions() {
      $scope.loaders.regions = true;
      $scope.regions = null;

      return OvhApiCloudProjectRegion.v6()
        .query({
          serviceName: $scope.projectId,
        })
        .$promise.then((regions) => {
          $scope.regions = regions;
        })
        .finally(() => {
          $scope.loaders.regions = false;
        });
    }

    function getAvailableRegions() {
      $scope.availableRegions = CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          OvhApiCloudProjectRegion.AvailableRegions()
            .v6()
            .query({ serviceName: $scope.projectId })
            .$promise.catch((error) =>
              CucServiceHelper.errorHandler(
                'cpci_add_regions_get_available_regions_error',
              )(error),
            ),
      });
      return $scope.availableRegions.load();
    }

    function init() {
      loadMessage();
      getAvailableRegions();
      return loadRegions().then(() => {
        $scope.loadStep('region');
      });
    }

    init();
  },
]);
