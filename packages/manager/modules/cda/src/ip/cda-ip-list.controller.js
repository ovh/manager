import ipAddTemplate from './add/cda-ip-add.html';
import ipDeleteTemplate from './delete/cda-ip-delete.html';

export default class CdaIpListCtrl {
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
      ips: undefined,
    };

    self.modals = {
      add: {
        template: ipAddTemplate,
        controller: 'CdaIpAddCtrl',
      },
      remove: {
        template: ipDeleteTemplate,
        controller: 'CdaIpDeleteCtrl',
      },
    };

    function initIps() {
      OvhApiDedicatedCeph.Acl()
        .v6()
        .resetAllCache();
      return OvhApiDedicatedCeph.Acl()
        .v6()
        .query({
          serviceName: $stateParams.serviceName,
        })
        .$promise.then((ips) => {
          self.datas.ips = ips;
          return ips;
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
      initIps()
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

    self.openDeleteModal = function openDeleteModal(ip) {
      self.openModal(
        self.modals.remove.template,
        self.modals.remove.controller,
        { ip },
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
        initIps();
      });
    };

    init();
  }
}
