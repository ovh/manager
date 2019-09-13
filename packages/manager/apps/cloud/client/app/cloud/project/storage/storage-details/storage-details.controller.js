angular.module('managerApp').controller('RA.storageDetailsCtrl', [
  '$interval',
  '$rootScope',
  '$scope',
  '$stateParams',
  '$translate',
  '$uibModal',
  '$window',
  'CLOUD_PCA_FILE_STATE',
  'OvhApiCloudProjectUser',
  'CloudStorageContainer',
  'CloudStorageContainerTasksRunner',
  'CloudStorageContainersConfiguration',
  'CucCloudMessage',
  'ovhDocUrl',
  function RAStorageDetailsCtrl($interval, $rootScope, $scope, $stateParams, $translate, $uibModal, $window, CLOUD_PCA_FILE_STATE,
    OvhApiCloudProjectUser, CloudStorageContainer, CloudStorageContainerTasksRunner,
    CloudStorageContainersConfiguration, CucCloudMessage, ovhDocUrl) {
    $scope.projectId = $stateParams.projectId;
    $scope.storageId = $stateParams.storageId;

    // make it accessible to the UI
    $scope.CLOUD_PCA_FILE_STATE = CLOUD_PCA_FILE_STATE;

    $scope.loaders = { details: true, pager: false, uploading: false };

    $scope.model = { allSelected: false, selected: [] };

    $scope.errors = { notfound: false, notdefined: false };

    $scope.showTask = false;
    $scope.globalProgress = 0;

    $scope.connectionInformation = {};
    $scope.storage = {};
    $scope.objects = [];
    $scope.maxSize = 20;
    $scope.password = null;
    $scope.guides = {
      title: $translate.instant('storage_details_guide_title'),
      list: [{
        name: $translate.instant('storage_details_guide_pca'),
        url: ovhDocUrl.getDocUrl('cloud/storage/pca'),
      }, {
        name: $translate.instant('storage_details_guide_pcs'),
        url: ovhDocUrl.getDocUrl('cloud/storage/pcs'),
      }],
      footer: $translate.instant('storage_details_guide_footer'),
    };
    $scope.messages = [];

    function refreshMessage() {
      $scope.messages = $scope.messageHandler.getMessages();
    }

    function loadMessage() {
      CucCloudMessage.unSubscribe('iaas.pci-project.compute.storage.details');
      $scope.messageHandler = CucCloudMessage.subscribe('iaas.pci-project.compute.storage.details', { onMessage: () => refreshMessage() });
    }

    $scope.computeStorageSize = function () {
      return _.sum(_.map($scope.objects, 'size'));
    };

    $scope.openDNSHelp = function () {
      $uibModal.open({
        templateUrl: 'app/cloud/project/storage/storage-hosting-help/modal.html',
        controller: 'RA.storage.dnsHelp',
        controllerAs: 'RA.storage.dnsHelp',
        params: {
          storage: $scope.storage,
        },
      });
    };

    $scope.getPcaPassword = function () {
      const { connectionInformation } = $scope;
      return [
        connectionInformation.osTenantName || '<tenant_name>',
        connectionInformation.osUsername || '<username>',
        '<password>',
      ].join('.');
    };

    $scope.addObjects = function () {
      $uibModal.open({
        templateUrl: 'app/cloud/project/storage/storage-add-object/modal.html',
        controller: 'RA.storage.addObject',
        controllerAs: 'RA.storage.addObject',
      }).result.then((response) => {
        uploadObject(response.files, response.prefix);
      });
    };

    $scope.fileDownload = function (file) {
      if (file.retrievalState === CLOUD_PCA_FILE_STATE.SEALED) {
        var index = locationOf(file.name, $scope.objects);
        if (index > -1) {
          $scope.objects[index] = _.assign(file, { sealingStateLoading: true });
        }
      }
      CloudStorageContainer.download($scope.projectId, $stateParams.storageId, file)
        .then((url) => {
          if (url) {
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          return getObject(file.name)
            .then((data) => {
              $scope.objects[index] = _.assign(file, data);
              return $scope.objects[index];
            })
            .then(setFileStateText);
        })
        .finally(() => {
          file.sealingStateLoading = false;
        });
    };

    $scope.delete = function (element) {
      $uibModal.open({
        templateUrl: 'app/cloud/project/storage/storage-delete-object/modal.html',
        controller: 'RA.storage.deleteObject',
        controllerAs: 'RA.storage.deleteObject',
        resolve: {
          params() {
            return [element];
          },
        },
      }).result.then(() => {
        deleteObject(element);
        resetSelectionModel();
      });
    };

    $scope.deleteAll = function () {
      const toDelete = _.compact(_.map($scope.model.selected, (selected, index) => (selected ? $scope.files[index] : null)));
      $uibModal.open({
        templateUrl: 'app/cloud/project/storage/storage-delete-object/modal.html',
        controller: 'RA.storage.deleteObject',
        controllerAs: 'RA.storage.deleteObject',
        resolve: {
          params() {
            return toDelete;
          },
        },
      }).result.then(() => {
        _.forEach(toDelete, (object) => {
          deleteObject(object);
        });
        resetSelectionModel();
      });
    };

    $scope.selectAll = function () {
      $scope.model.selected = _.times($scope.files.length, () => $scope.model.allSelected);
    };

    $scope.select = function () {
      $scope.model.allSelected = $scope.model.selected.length === $scope.files.length && _.all($scope.model.selected, select => select);
    };

    $scope.manySelected = function () {
      return $scope.selectionCount() > 1;
    };

    $scope.selectionCount = function () {
      return _.size(_.filter($scope.model.selected, value => value));
    };

    $scope.$on('delete_object', (event, data) => {
      if (data[0] === $scope.storage.name && data[1] && $scope.storage) {
        const index = locationOf(data[1], $scope.objects);
        const elem = $scope.objects[index];
        $scope.objects.splice(index, 1);
        $scope.storage.stored -= elem.size;
      }
    });

    init();

    function uploadObject(files, prefix) {
      prefix = prefix.substr(1);

      let queuePromise;

      angular.forEach(files, (file) => {
        queuePromise = CloudStorageContainerTasksRunner.addTask(`upload_${$scope.projectId}_${$stateParams.storageId}`, createUploadTask(file, prefix));
      });

      queuePromise.then(() => {
        if (CloudStorageContainerTasksRunner.countErrorTasks()) {
          CucCloudMessage.error($translate.instant('storage_object_upload_error'));
        }
      });

      function createUploadTask(file, prefix) {
        return function () {
          $scope.loaders.uploading = true;
          return CloudStorageContainer.upload($scope.projectId, $stateParams.storageId, {
            file,
            prefix,
          })
            .then((result) => {
              refreshList();
              return result;
            })
            .finally(() => {
              $scope.loaders.uploading = false;
            });
        };

        function refreshList() {
          try {
            const newFile = {
              name: prefix + file.name,
              lastModified: Date.now(),
              size: file.size,
              contentType: file.type,
              retrievalState: $scope.storage.shortcut === 'pca' ? CLOUD_PCA_FILE_STATE.SEALED : CLOUD_PCA_FILE_STATE.UNSEALED,
              region: $scope.storage.region,
            };
            setFileStateText(newFile);
            insertIntoStorageList(newFile);
            $scope.storage.stored += file.size;
          } catch (e) {}
        }
      }
    }

    function deleteObject(elem) {
      const queuePromise = CloudStorageContainerTasksRunner.addTask(`upload_${$scope.projectId}_${$stateParams.storageId}`, createDeleteTask(elem));
      queuePromise.then(() => {
        if (CloudStorageContainerTasksRunner.countErrorTasks()) {
          CucCloudMessage.error($translate.instant('storage_object_delete_error'));
        }
      });
      return queuePromise;

      function createDeleteTask(elem) {
        return function () {
          const index = _.findIndex($scope.objects, { name: elem.name, lastModified: elem.lastModified, contentType: elem.contentType });
          if (index === -1) {
            return;
          }
          return CloudStorageContainer.delete($scope.projectId, $stateParams.storageId, elem.name)
            .then((result) => {
              $rootScope.$broadcast('delete_object', [$scope.storage.name, elem.name]);
              return result;
            });
        };
      }
    }

    function getObject(name) {
      return CloudStorageContainer.list($scope.projectId, $stateParams.storageId)
        .then((details) => {
          const file = _.find(details.objects, { name });
          file.region = details.region;
          return file;
        });
    }

    function getObjectList(marker) {
      const options = { limit: 1000 };

      if (marker) {
        options.start = marker;
      }

      $scope.loaders.pager = true;
      $scope.loaders.details = true;

      let storageDetails;

      return CloudStorageContainer.list($scope.projectId, $stateParams.storageId)
        .then((details) => {
          storageDetails = details;
          $scope.title = `${$translate.instant('storage_object_title')} : ${storageDetails.name}`;
          return CloudStorageContainer.getMetaData($scope.projectId, $stateParams.storageId);
        })
        .then((metaData) => {
          storageDetails.shortcut = metaData.shortcut;

          _.each(storageDetails.objects, (file) => {
            setFileStateText(file);
          });

          $scope.objects = $scope.objects.concat(storageDetails.objects);
          $scope.storage = storageDetails;

          if (storageDetails.objects.length === options.limit) {
            $scope.getObjectList(encodeURIComponent(_.last($scope.objects).name));
          } else {
            const { accessCache } = CloudStorageContainersConfiguration;
            const endpoint = _.find(accessCache.get($scope.projectId).endpoints, { region: $scope.storage.region });
            $scope.url = `${endpoint.url}/${encodeURIComponent($scope.storage.name)}`;
            $scope.loaders.pager = false;
          }

          return loadConnectionInformation($scope.storage.region);
        })
        .catch((details) => {
          $scope.loaders.pager = false;

          if (details.status === 404) {
            $scope.errors.notfound = true;
          } else {
            $scope.errors.notdefined = true;
          }
        })
        .finally(() => {
          $rootScope.$broadcast('stopLoading');
          $scope.loaders.details = false;
        });
    }

    function setFileStateText(file) {
      switch (file.retrievalState) {
        case CLOUD_PCA_FILE_STATE.SEALED:
          file.stateText = $translate.instant('storage_availability_sealed');
          break;
        case CLOUD_PCA_FILE_STATE.UNSEALED:
          file.stateText = $translate.instant('storage_availability_unsealed');
          break;
        case CLOUD_PCA_FILE_STATE.UNSEALING:
          startUnsealingCountdown(file);
          break;
        default:
          file.stateText = '';
      }
    }

    function startUnsealingCountdown(file) {
      file.stateText = retrivalCountdownText(file.retrievalDelay);
      file.interval = $interval(() => {
        file.stateText = retrivalCountdownText(file.retrievalDelay);
        file.retrievalDelay -= 1;
        if (file.retrievalDelay === 0) {
          file.retrievalState = CLOUD_PCA_FILE_STATE.UNSEALED;
          file.stateText = $translate.instant('storage_availability_unsealed');
        }
      }, 1000, file.retrievalDelay);
    }

    function loadConnectionInformation(region) {
      const request = {
        serviceName: $stateParams.projectId,
      };

      if ($scope.storage.shortcut !== 'pca') {
        return;
      }

      return OvhApiCloudProjectUser.v6().query(request).$promise
        .then((users) => {
          $scope.users = users;
          if (users.length > 0) {
            request.userId = users[0].id;
            request.region = region;
            return OvhApiCloudProjectUser.Aapi().openrc(request).$promise;
          }
          return null;
        })
        .then((response) => {
          if (!response) {
            return;
          }

          $scope.connectionInformation = response;

          if ($scope.users.length > 1) {
            $scope.connectionInformation.osUsername = null;
          }
        });
    }

    function retrivalCountdownText(delay) {
      if (delay === 0) {
        return $translate.instant('storage_availability_unsealed');
      }
      const hours = Math.floor(delay / 3600);
      const minutes = Math.floor((delay - hours * 3600) / 60);
      const seconds = delay - hours * 3600 - minutes * 60;
      const delayText = _.map([hours, minutes, seconds], time => _.padLeft(time, 2, '0')).join(':');
      return $translate.instant('storage_availability_unsealing', { delay: delayText });
    }

    function insertIntoStorageList(element) {
      if (!$scope.objects || $scope.objects.length === 0) {
        $scope.objects = [element];
        return;
      }

      const index = locationOf(element.name, $scope.objects);

      if (index >= $scope.objects.length) {
        $scope.objects.push(element);
        return;
      }

      if ($scope.objects[index].name !== element.name) {
        $scope.objects.splice(index, 0, element);
      }
    }

    function locationOf(element, array) {
      let low = 0;
      let high = array.length;
      let mid = -1;
      let c = 0;
      while (low < high) {
        mid = parseInt((low + high) / 2, 10);
        c = sortAlpha(array[mid].name, element);
        if (c < 0) {
          low = mid + 1;
        } else if (c > 0) {
          high = mid;
        } else {
          return mid;
        }
      }
      return low;
    }

    function sortAlpha(a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }

    $scope.$watch('currentPage', () => {
      resetSelectionModel();
    });

    function resetSelectionModel() {
      $scope.model.selected = [];
      $scope.model.allSelected = false;
    }

    function init() {
      getObjectList();
      loadMessage();
    }
  }]);
