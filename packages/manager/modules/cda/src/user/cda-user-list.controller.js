import addTemplate from './add/cda-user-add.html';
import deleteTemplate from './delete/cda-user-delete.html';

export default class CdaUserListCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $uibModal,
    $translate,
    OvhApiDedicatedCeph,
    CucCloudMessage,
    CdaService,
  ) {
    const self = this;

    self.datas = {
      users: undefined,
    };

    self.options = {
      maxPoolDisplay: 4,
    };

    self.modals = {
      add: {
        template: addTemplate,
        controller: 'CdaUserAddCtrl',
      },
      remove: {
        template: deleteTemplate,
        controller: 'CdaUserDeleteCtrl',
      },
    };

    self.loading = true;

    function initUsers() {
      return CdaService.getUsers($stateParams).then((users) => {
        self.datas.users = users;
        return users;
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
      initUsers()
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

    self.openDeleteModal = function openDeleteModal(user) {
      self.openModal(
        self.modals.remove.template,
        self.modals.remove.controller,
        user,
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
        initUsers();
      });
    };

    self.viewPermissions = function viewPermissions(name) {
      return $state.go(
        'cda.dashboard.cda-user.cda-user-details.cda-user-details-permission-list',
        { userName: name },
      );
    };

    self.isTruncatedPoolArray = function isTruncatedPoolArray(
      poolArray,
      index,
    ) {
      return poolArray.length - 1 > index;
    };

    init();
  }
}
