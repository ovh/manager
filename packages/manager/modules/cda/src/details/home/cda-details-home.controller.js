import find from 'lodash/find';

import cdaDetailEditTemplate from './detail/edit/cda-detail-edit.html';

export default class CdaDetailHomeCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $scope,
    $interval,
    $uibModal,
    $translate,
    OvhApiDedicatedCeph,
    CucCloudMessage,
    CdaService,
  ) {
    const self = this;
    let taskPoll;

    self.pollingInterval = 10000;

    self.serviceName = $stateParams.serviceName;

    self.CdaService = CdaService;

    self.datas = {
      health: {},
      tasks: [],
      availableBytes: {},
      usedBytes: {},
      totalBytes: {},
      crushTunablesOptions: [],
    };

    self.loading = false;

    self.modals = {
      edit: {
        template: cdaDetailEditTemplate,
        controller: 'CdaDetailEditCtrl',
      },
    };

    function initHealth() {
      return OvhApiDedicatedCeph.v6()
        .health({
          serviceName: self.serviceName,
        })
        .$promise.then((health) => {
          self.datas.health = health;
          self.datas.totalBytes = health.availableBytes;
          self.datas.availableBytes = health.availableBytes;
          self.datas.usedBytes = health.usedBytes;
          return health;
        });
    }

    function initCrushTunablesOptions() {
      return OvhApiDedicatedCeph.v6()
        .schema({
          serviceName: self.serviceName,
        })
        .$promise.then((schema) => {
          self.datas.crushTunablesOptions =
            schema.models[
              'dedicated.ceph.clusterUpdate.crushTunablesEnum'
            ].enum;
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

    function initTasks() {
      OvhApiDedicatedCeph.Task()
        .v6()
        .resetQueryCache();
      OvhApiDedicatedCeph.Task()
        .v6()
        .query({
          serviceName: self.serviceName,
        })
        .$promise.then((tasks) => {
          // If we passed from a state with no tasks to a state with tasks
          // or a state with tasks to a state with no tasks we update the details.
          if (
            (tasks.length === 0 && self.datas.tasks.length !== 0) ||
            (tasks.length !== 0 && self.datas.tasks.length === 0)
          ) {
            CdaService.initDetails(self.serviceName, true);
          }

          self.datas.tasks = tasks;
        })
        .catch((error) => {
          displayError(error);
        });
    }

    function pollTaskList() {
      initTasks();
      taskPoll = $interval(() => {
        initTasks();
      }, self.pollingInterval);
    }

    function initUsers() {
      return CdaService.getUsers($stateParams).then((users) => {
        self.datas.users = users;
        if (users.length === 0) {
          const message = {
            text: $translate.instant('cda_detail_info_no_user'),
            link: {
              type: 'state',
              text: $translate.instant('cda_detail_info_create_user'),
              state: 'cda.dashboard.cda-user',
            },
          };
          CucCloudMessage.info(message);
        }
        return users;
      });
    }

    function init() {
      self.loading = true;

      $q.all([initHealth(), initCrushTunablesOptions()])
        .catch((errors) => {
          displayError(find(errors, (error) => error));
        })
        .finally(() => {
          self.loading = false;
        });
      pollTaskList();
      initUsers();
    }

    function openModal(template, controller, params) {
      $uibModal.open({
        windowTopClass: 'cui-modal',
        template,
        controller,
        controllerAs: controller,
        resolve: {
          items() {
            return params;
          },
        },
      });
    }

    self.openEditModal = function openEditModal() {
      openModal(self.modals.edit.template, self.modals.edit.controller, {
        details: self.CdaService.currentService,
        crushTunablesOptions: self.datas.crushTunablesOptions,
      });
    };

    $scope.$on('$destroy', () => {
      $interval.cancel(taskPoll);
    });

    init();
  }
}
