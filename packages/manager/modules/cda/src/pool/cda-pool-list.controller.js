import addTemplate from './add/cda-pool-add.html';
import deleteTemplate from './delete/cda-pool-delete.html';

export default class CdaPoolListCtrl {
  /* @ngInject */
  constructor(
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
        template: addTemplate,
        controller: 'CdaPoolAddCtrl',
      },
      remove: {
        template: deleteTemplate,
        controller: 'CdaPoolDeleteCtrl',
      },
    };

    function initPools() {
      OvhApiDedicatedCeph.Pool()
        .v6()
        .resetAllCache();

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
      self.openModal(self.modals.add.template, self.modals.add.controller);
    };

    self.openDeleteModal = function openDeleteModal(pool) {
      self.openModal(
        self.modals.remove.template,
        self.modals.remove.controller,
        { pool },
      );
    };

    self.openModal = function openModal(template, controller, params) {
      const modal = $uibModal.open({
        windowTopClass: 'cui-modal',
        template,
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
  }
}
