angular
  .module('managerApp')
  .controller('CdaPoolListCtrl', function CdaPoolListCtrl(
    $q,
    $stateParams,
    $uibModal,
    $translate,
    OvhApiDedicatedCeph,
    CucCloudMessage,
  ) {
    const self = this;

    self.loading = false;

    self.datas = {
      pools: undefined,
    };

    self.modals = {
      add: {
        templateUrl: 'app/cda/pool/add/cda-pool-add.html',
        controller: 'CdaPoolAddCtrl',
      },
      remove: {
        templateUrl: 'app/cda/pool/delete/cda-pool-delete.html',
        controller: 'CdaPoolDeleteCtrl',
      },
    };

    function initPools() {
      OvhApiDedicatedCeph.Pool().v6().resetAllCache();

      return OvhApiDedicatedCeph.Pool()
        .v6()
        .query({
          serviceName: $stateParams.serviceName,
        })
        .$promise.then((pools) => {
          self.datas.pools = pools;
          return pools;
        });
    }

    function displayError(error) {
      CucCloudMessage.error(
        [
          $translate.instant('ceph_common_error'),
          (error.data && error.data.message) || '',
        ].join(' '),
      );
    }

    function init() {
      self.loading = true;
      initPools()
        .catch((error) => {
          displayError(error);
        })
        .finally(() => {
          self.loading = false;
        });
    }

    self.openAddModal = function openAddModal() {
      self.openModal(self.modals.add.templateUrl, self.modals.add.controller);
    };

    self.openDeleteModal = function openDeleteModal(pool) {
      self.openModal(
        self.modals.remove.templateUrl,
        self.modals.remove.controller,
        { pool },
      );
    };

    self.openModal = function openModal(template, controller, params) {
      const modal = $uibModal.open({
        windowTopClass: 'cui-modal',
        templateUrl: template,
        controller,
        controllerAs: controller,
        resolve: {
          items: () => params,
        },
      });

      modal.result.then(() => {
        initPools();
      });
    };

    init();
  });
