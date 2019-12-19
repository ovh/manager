import upperFirst from 'lodash/upperFirst';
import clone from 'lodash/clone';
import get from 'lodash/get';

angular.module('App').controller('DedicatedCloudSecurityCtrl', function DedicatedCloudSecurityCtrl($rootScope, $stateParams, $scope, $uibModal, DedicatedCloud, OvhApiDedicatedCloud, $translate) {
  const self = this;
  let forceRefresh = false;

  $scope.policies = {
    model: null,
    info: null,
  };
  $scope.policySearchSelected = null;

  $scope.selectedPolicies = [];

  $scope.loaders = {
    table: false,
    search: false,
    policiesInfo: true,
  };

  $scope.$on('dedicatedCloud.tabs.policy.info.refresh', () => {
    $scope.policies.info = null;
    $scope.loadInfo();
  });

  $scope.$on('dedicatedCloud.tabs.policy.info.refreshaccess', () => {
    $scope.$broadcast('dedicatedCloud.tabs.policy.info.refresh');
    $rootScope.$broadcast('dedicatedcloud.informations.reload');
  });

  $scope.loadInfo = function loadInfo() {
    $scope.loaders.policiesInfo = true;

    DedicatedCloud.getSecurityInformations($stateParams.productId).then(
      (informations) => {
        $scope.policies.info = informations;
        $scope.loaders.policiesInfo = false;
      },
      (data) => {
        $scope.loaders.policiesInfo = false;
        $scope.setMessage($translate.instant('dedicatedCloud_dashboard_loading_error'), { type: 'ERROR', message: data.message });
      },
    );
  };

  $scope.loadPaginated = function loadPaginated(count, offset) {
    $scope.loaders.search = true;
    $scope.loaders.table = true;

    DedicatedCloud.getSecurityPolicies($stateParams.productId, count, offset, forceRefresh)
      .then((paginatedPolicies) => {
        forceRefresh = false;
        $scope.loaders.table = false;
        $scope.policies.model = paginatedPolicies;
      }, self.onError)
      .then(self.endRequest);
  };

  function initSelection() {
    if ($scope.policies
      && $scope.policies.model
      && $scope.policies.model.list
      && $scope.policies.model.list.results) {
      let i = 0;
      let l;
      for (i, l = $scope.policies.model.list.results.length; i < l; i += 1) {
        if (~$scope.selectedPolicies.indexOf($scope.policies.model.list.results[i].id)) {
          $scope.policies.model.list.results[i].selected = true;
        } else {
          $scope.policies.model.list.results[i].selected = false;
        }
      }
    }
  }

  $scope.$watch('selectedPolicies.length', () => {
    initSelection();
  });

  $scope.$on('dedicatedCloud.tabs.policy.refresh', () => {
    $scope.selectedPolicies = [];
    self.reloadCurrentPage();
  });

  self.reloadCurrentPage = function reloadCurrentPage() {
    if (!$scope.loaders.table) {
      forceRefresh = true;
      $scope.$broadcast('paginationServerSide.reload');
    }
  };

  self.formatKmsStatus = function formatKmsStatus(state) {
    switch (state) {
      case 'creating':
      case 'updating':
      case 'toCreate':
      case 'toUpdate':
        return 'info';
      case 'deleting':
      case 'toDelete':
      case 'unknown':
        return 'warning';
      case 'delivered':
        return 'success';
      default:
        return state;
    }
  };

  $scope.globalCheckboxPoliciesStateChange = function globalCheckboxPoliciesStateChange(state) {
    if ($scope.policies
      && $scope.policies.model
      && $scope.policies.model.list
      && $scope.policies.model.list.results) {
      let i = 0;
      let l;
      switch (state) {
        case 0:
          $scope.selectedPolicies = [];
          break;
        case 1:
          for (i, l = $scope.policies.model.list.results.length; i < l; i += 1) {
            if (!~$scope.selectedPolicies.indexOf($scope.policies.model.list.results[i].id)) {
              $scope.selectedPolicies.push($scope.policies.model.list.results[i].id);
            }
          }
          break;
        case 2:
          for (i, l = $scope.policies.model.fullNetworksList.length; i < l; i += 1) {
            if (!~$scope.selectedPolicies.indexOf($scope.policies.model.fullNetworksList[i])) {
              $scope.selectedPolicies.push($scope.policies.model.fullNetworksList[i]);
            }
          }
          break;
        default:
          break;
      }
    }
  };

  $scope.togglePolicy = function togglePolicy(entry) {
    const index = $scope.selectedPolicies.indexOf(entry);
    if (~index) {
      $scope.selectedPolicies.splice(index, 1);
    } else {
      $scope.selectedPolicies.push(entry);
    }
  };

  self.endRequest = function endRequest() {
    $scope.loaders.table = false;
    $scope.loaders.search = false;
  };

  self.onError = function onError(error) {
    $scope.setMessage($translate.instant('dedicatedCloud_dashboard_loading_error'), get(error, 'data', error));
  };

  function createModalObject(action, objectToResolve) {
    return $uibModal.open({
      templateUrl: `dedicatedCloud/security/kms/${action}/dedicatedCloud-security-kms-${action}.html`,
      controller: `DedicatedCloudSecurityKMS${upperFirst(action)}Ctrl`,
      controllerAs: '$ctrl',
      backdrop: 'static',
      resolve: objectToResolve,
    });
  }

  self.addKms = function addKms() {
    const kmsCreationModal = createModalObject('add');

    kmsCreationModal.result.then(() => {
      OvhApiDedicatedCloud.VMEncryption().kms().v6().resetCache();
      OvhApiDedicatedCloud.VMEncryption().kms().v6().resetQueryCache();

      $scope.loadInfo();
      $scope.setMessage($translate.instant('dedicatedCloud_vm_encryption_kms_added'), {});
    });
  };

  self.deleteKms = function deleteKms(kmsToDelete) {
    const resolveKms = {
      kmsToDelete: () => kmsToDelete,
    };
    const kmsDeletionModal = createModalObject('delete', resolveKms);

    kmsDeletionModal.result.then(() => {
      OvhApiDedicatedCloud.VMEncryption().kms().v6().resetCache();
      OvhApiDedicatedCloud.VMEncryption().kms().v6().resetQueryCache();

      $scope.loadInfo();
      $scope.setMessage($translate.instant('dedicatedCloud_vm_encryption_kms_deleted'), {});
    });
  };

  self.editKms = function editKms(kmsToEdit) {
    const resolveKms = {
      kmsToEdit: () => clone(kmsToEdit),
    };
    const kmsEditionModal = createModalObject('edit', resolveKms);

    kmsEditionModal.result.then(() => {
      OvhApiDedicatedCloud.VMEncryption().kms().v6().resetCache();
      OvhApiDedicatedCloud.VMEncryption().kms().v6().resetQueryCache();

      $scope.loadInfo();
      $scope.setMessage($translate.instant('dedicatedCloud_vm_encryption_kms_edited'), {});
    });
  };

  self.getVMEncryptionKMSList = function getVMEncryptionKMSList({ offset, pageSize }) {
    return DedicatedCloud.getVMEncryptionKMSList($stateParams.productId).then((kmsIds) => ({
      data: kmsIds
        .slice(offset - 1, offset - 1 + pageSize)
        .map((id) => ({ id })),
      meta: {
        totalCount: kmsIds.length,
      },
    }));
  };

  self.getVMEncryptionKMSDetail = function getVMEncryptionKMSDetail(id) {
    return DedicatedCloud.getVMEncryptionKMSDetail($stateParams.productId, id);
  };

  $scope.loadInfo();
});
