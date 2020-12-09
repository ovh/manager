angular
  .module('managerApp')
  .controller('CdaIpListCtrl', function CdaIpListCtrl(
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
        templateUrl: 'app/cda/ip/add/cda-ip-add.html',
        controller: 'CdaIpAddCtrl',
      },
      remove: {
        templateUrl: 'app/cda/ip/delete/cda-ip-delete.html',
        controller: 'CdaIpDeleteCtrl',
      },
    };

    function initIps() {
      OvhApiDedicatedCeph.Acl().v6().resetAllCache();
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
      self.openModal(self.modals.add.templateUrl, self.modals.add.controller);
    };

    self.openDeleteModal = function openDeleteModal(ip) {
      self.openModal(
        self.modals.remove.templateUrl,
        self.modals.remove.controller,
        { ip },
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
        initIps();
      });
    };

    init();
  });
