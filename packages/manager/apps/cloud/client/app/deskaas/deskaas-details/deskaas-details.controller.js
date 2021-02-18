import difference from 'lodash/difference';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import mapValues from 'lodash/mapValues';
import set from 'lodash/set';

import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { Environment } from '@ovh-ux/manager-config';

import { RENEW_URL } from './deskaas-details.constants';

angular
  .module('managerApp')
  .controller('DeskaasDetailsCtrl', function DeskaasDetailsCtrl(
    OvhApiDeskaasService,
    $stateParams,
    $scope,
    CucControllerHelper,
    CucCloudMessage,
    $translate,
    $state,
    $q,
    DESKAAS_ACTIONS,
    $uibModal,
    DeskaasService,
    DESKAAS_REFERENCES,
    SidebarMenu,
    CucFeatureAvailabilityService,
    CucServiceHelper,
  ) {
    const self = this;

    self.services = {};
    self.details = {};
    self.messages = [];
    self.user = {};
    self.upgradeOptions = [];
    self.selectedUpgrade = '';
    self.tasksHandler = null;
    self.CucServiceHelper = CucServiceHelper;

    self.references = DESKAAS_REFERENCES;

    self.OrderPlanOffers = [];

    self.actions = {
      reinit: {
        text: $translate.instant('vdi_btn_restore'),
        callback: () => self.restoreService($stateParams.serviceName),
        isAvailable: () => self.flags.editable(),
      },
      restart: {
        text: $translate.instant('vdi_btn_reboot'),
        callback: () => self.rebootService($stateParams.serviceName),
        isAvailable: () => self.flags.editable(),
      },
      changePassword: {
        text: $translate.instant('vdi_btn_reset_password'),
        callback: () => self.resetPassword($stateParams.serviceName),
        isAvailable: () => self.flags.editable(),
      },
      remove: {
        text: $translate.instant('vdi_btn_delete'),
        callback: () => self.deleteService($stateParams.serviceName),
        isAvailable: () => self.flags.editable(),
      },
      accessConsole: {
        text: $translate.instant('vdi_btn_console'),
        callback: () => self.getConsole($stateParams.serviceName),
        isAvailable: () => self.flags.editable(),
      },
      changeOffer: {
        text: $translate.instant('vdi_btn_upgrade'),
        callback: () => self.upgrade($stateParams.serviceName),
        isAvailable: () => self.flags.editable() && self.flags.can_upgrade(),
      },
      changeAlias: {
        text: $translate.instant('common_modify'),
        callback: () => self.changeAlias($stateParams.serviceName),
        isAvailable: () => self.flags.editable(),
      },
      manageAutorenew: {
        text: $translate.instant('common_manage'),

        href:
          Environment.getRegion() === 'EU'
            ? buildURL('dedicated', '#/billing/autoRenew', {
                selectedType: 'DESKAAS',
                searchText: $stateParams.serviceName,
              })
            : RENEW_URL[Environment.getRegion()],

        isAvailable: () => true,
      },
      manageContact: {
        text: $translate.instant('common_manage'),
        href:
          Environment.getRegion() === 'EU'
            ? buildURL('dedicated', '#/useraccount/contacts', {
                tab: 'SERVICES',
                serviceName: $stateParams.serviceName,
              })
            : null,
        isAvailable: () =>
          CucFeatureAvailabilityService.hasFeature('CONTACTS', 'manage'),
      },
    };

    self.loadMessage = function loadMessage() {
      CucCloudMessage.unSubscribe('deskaas.details');
      self.messageHandler = CucCloudMessage.subscribe('deskaas.details', {
        onMessage: () => self.refreshMessage(),
      });
    };

    self.refreshMessage = function refreshMessage() {
      self.messages = self.messageHandler.getMessages();
    };

    /*
      restartInstance: {
        text: this.$translate.instant("cloud_db_home_tile_status_instance_restart"),
        callback: () => this.CloudDbActionService.showInstanceRestartModal(
          this.projectId,
          this.instanceId
        ),
        isAvailable: () => !this.instance.loading && !this.instance.data.taskId
      }
    */

    function handleCancelConfirmation() {
      if ($stateParams.action === 'confirmTerminate') {
        return self.confirmTerminate($stateParams.serviceName);
      }
      return $q.when();
    }

    function updateTasksStatus(taskDetail, isUserTask) {
      self.tasksHandler.addOrUpdate(taskDetail, isUserTask);
    }

    function handleTask(taskId, isUserTask) {
      return OvhApiDeskaasService.v6()
        .getTask({ serviceName: $stateParams.serviceName, taskId }, null)
        .$promise.then((taskDetails) => {
          updateTasksStatus(taskDetails, isUserTask);
        });
    }

    function init(initTasks) {
      // eslint-disable-next-line no-use-before-define
      self.tasksHandler = new TasksHandler();

      self.serviceName = $stateParams.serviceName;
      self.token = $stateParams.token;

      self.flags.init.serviceInfos = true;
      self.flags.init.details = true;
      self.loadMessage();

      $q.all([
        self.serviceInfos().then(() => {
          self.getDetails().then(() => {
            DeskaasService.getMe().then((me) => {
              self.OrderPlanOffers = DeskaasService.fetchProductPlans(me);
            });
            if (self.services.status === 'ok') {
              self.flags.init.getTasks = true;
              self.flags.init.user = true;
              $q.all([
                handleCancelConfirmation(),
                initTasks ? self.getRunningTasks() : $q.when(),
                self.getUser(),
                $stateParams.followTask
                  ? handleTask($stateParams.followTask)
                  : $q.when(),
              ]);
            }
          });
        }),
      ]);
    }

    function reinit(taskName) {
      switch (taskName) {
        case DESKAAS_ACTIONS.RESTORE:
        case DESKAAS_ACTIONS.REBOOT:
        case DESKAAS_ACTIONS.DELETE:
        case DESKAAS_ACTIONS.UPDATE_USER_PWD:
          // do nothing
          break;

        case DESKAAS_ACTIONS.UPGRADE:
          init(false);
          break;

        case DESKAAS_ACTIONS.UPDATE_ALIAS:
        case DESKAAS_ACTIONS.UPDATE_USERNAME:
          self.getDetails().then(() => {
            self.changeMenuTitle(
              self.details.serviceName,
              self.details.alias !== 'noAlias'
                ? self.details.alias
                : self.details.serviceName,
            );
          });
          break;
        default:
          break;
      }
    }

    function onTaskError(taskDetails) {
      if (!isEmpty(taskDetails)) {
        CucCloudMessage.error(
          $translate.instant('vdi_task_error', taskDetails),
        );
      } else {
        CucCloudMessage.error($translate.instant('common_api_error'));
      }

      self.flags.restoring = false;
      self.flags.deleting = false;
      self.flags.upgrading = false;
      self.flags.resettingPassword = false;
      // self.flags.error = true;
    }

    function onTaskSuccess(taskDetails) {
      switch (taskDetails.name) {
        case DESKAAS_ACTIONS.RESTORE:
          self.flags.restoring = false;
          CucCloudMessage.success($translate.instant('vdi_restored'));
          break;

        case DESKAAS_ACTIONS.REBOOT:
          self.flags.rebooting = false;
          CucCloudMessage.success($translate.instant('vdi_rebooted'));
          break;

        case DESKAAS_ACTIONS.DELETE:
          self.flags.deleting = false;
          CucCloudMessage.success($translate.instant('vdi_deleted'));
          break;

        case DESKAAS_ACTIONS.UPGRADE:
          self.flags.upgrading = false;
          CucCloudMessage.success($translate.instant('vdi_upgraded'));
          break;

        case DESKAAS_ACTIONS.UPDATE_USER_PWD:
          self.flags.resettingPassword = false;
          CucCloudMessage.success($translate.instant('vdi_pwd_resetted'));
          break;

        case DESKAAS_ACTIONS.UPDATE_ALIAS:
          self.flags.changingAlias = false;
          CucCloudMessage.success($translate.instant('vdi_alias_changed'));
          break;

        case DESKAAS_ACTIONS.UPDATE_USERNAME:
          self.flags.changingUsername = false;
          CucCloudMessage.success($translate.instant('vdi_username_changed'));
          break;

        case DESKAAS_ACTIONS.CONSOLE_ACCESS:
          CucCloudMessage.success($translate.instant('vdi_console_done'));
          break;
        default:
          break;
      }

      reinit(taskDetails.name);
    }

    // Task handler
    const TasksHandler = function TasksHandler() {
      // FIXME we do not check if some new task are created in another session
      // List of tasks to poll
      const selfTask = this;
      selfTask.tasks = {};
      selfTask.cleanTasks = [];
      const allowedTask = []; // use getAllowedTask to populate the array

      this.getAllowedTasks = function getAllowedTasks() {
        if (allowedTask.length === 0) {
          // Get taskName from actions constant
          Object.keys(DESKAAS_ACTIONS).forEach((taskName) => {
            allowedTask.push(DESKAAS_ACTIONS[taskName]);
          });
        }
        return allowedTask;
      };

      // Do we already know this task
      this.isIn = function isIn(task) {
        return typeof selfTask.tasks[task.taskId] !== 'undefined';
      };

      this.length = function length() {
        return Object.keys(selfTask.tasks).length;
      };

      // Check if we have running task
      this.tasksIsRunning = function tasksIsRunning() {
        let isRunning = false;
        Object.keys(selfTask.tasks).forEach((key) => {
          const value = selfTask.tasks[key];
          // We do not block if the console_access is not done
          if (
            value.name !== DESKAAS_ACTIONS.CONSOLE_ACCESS &&
            value.state !== 'done' &&
            value.state !== 'canceled'
          ) {
            isRunning = true;
          }
        });
        return isRunning;
      };

      this.getCleanTasks = function getCleanTasks() {
        return mapValues(selfTask.tasks, (value) => value);
      };

      // Check if we have a task on error
      this.taskOnError = function taskOnError() {
        let onError = false;
        Object.keys(selfTask.tasks).forEach((key) => {
          const value = selfTask.tasks[key];
          if (value.state === 'error') {
            onError = true;
          }
        });
        return onError;
      };

      this.addOrUpdate = function addOrUpdate(task, isUserTask) {
        if (typeof task.taskId === 'undefined') {
          return;
        }
        if (selfTask.getAllowedTasks().indexOf(task.name) === -1) {
          return; // task not allowed
        }

        const opts = {
          serviceName: $stateParams.serviceName,
          taskId: task.taskId,
          isUserTask,
        };
        set(
          task,
          'displayState',
          $translate.instant(`vdi_task_state_${task.state}`),
        );
        set(
          task,
          'displayName',
          $translate.instant(`vdi_task_name_${task.name}`),
        );
        set(task, 'status', task.state);
        if (selfTask.isIn(task)) {
          // we have the task, we need to update
          // TODO If task change from one status to error or problem we need to display a message
          if (
            (task.state === 'error' || task.state === 'problem') &&
            selfTask.tasks[task.taskId].state !== task.state
          ) {
            // Display message and set flags
            onTaskError(task);
          }
          selfTask.tasks[task.taskId].state = task.state;
          selfTask.tasks[task.taskId].displayState = task.displayState;
          selfTask.tasks[task.taskId].displayName = task.displayName;
          selfTask.tasks[task.taskId].lastModificationDate =
            task.lastModificationDate;
          selfTask.tasks[task.taskId].progress = task.progress;
          selfTask.tasks[task.taskId].status = task.state;
          // TODO remove task if status == 'done' and display a message
          if (task.state === 'done') {
            OvhApiDeskaasService.stopPollTask($scope, opts);
            onTaskSuccess(task);
          } else if (task.state === 'canceled') {
            OvhApiDeskaasService.stopPollTask($scope, opts);
          }
          return;
        }
        set(task, 'serviceName', $stateParams.serviceName);
        set(task, 'isUserTask', false);
        set(
          task,
          'poller',
          OvhApiDeskaasService.pollTask($scope, opts).then(
            selfTask.addOrUpdate,
            selfTask.addOrUpdate,
            selfTask.addOrUpdate,
          ),
        );
        // Add a new entry in the map
        selfTask.tasks[task.taskId] = task;
        selfTask.cleanTasks.push(task);
      };
    };

    self.flags = {
      init: {
        getTasks: false,
        details: false,
        serviceInfos: false,
        user: false,
      },
      can_upgrade() {
        let ref = [];
        // Tasks are retrieved, no upgrading and planCode and offers are retrieved
        if (
          !self.flags.init.getTasks &&
          !self.flags.upgrading &&
          has(self, 'details.planCode') &&
          self.OrderPlanOffers.length !== 0
        ) {
          ref = DeskaasService.getUpgradeOptions(self.details.planCode);
        }
        self.upgradeOptions = ref;
        return self.upgradeOptions.length !== 0;
      },
      initializing() {
        return (
          self.flags.init.getTasks ||
          self.flags.init.details ||
          self.flags.init.serviceInfos ||
          self.flags.init.user
        );
      },
      restoring: false,
      rebooting: false,
      upgrading: false,
      resettingPassword: false,
      changingAlias: false,
      changingUsername: false,
      deleting: false,
      error() {
        return self.tasksHandler.taskOnError();
      },
      taskRunning() {
        return self.tasksHandler.tasksIsRunning();
      },
      ready() {
        return !self.flags.taskRunning();
      },
      actionable() {
        return self.services.status === 'ok';
      },
      editable() {
        return (
          self.flags.ready() &&
          !self.flags.initializing() &&
          !self.flags.error() &&
          self.flags.actionable()
        );
      },
    };

    function handleMethodCall(promise, success) {
      return promise.then(success).catch((err) => {
        const msg = get(err, 'data.message', '');
        CucCloudMessage.error(
          [$translate.instant('common_api_error'), msg].join(' '),
        );
        return $q.reject(err);
      });
    }

    function handleServiceMethodCall(promise, successMessage, flagName) {
      self.flags[flagName] = true;

      return handleMethodCall(promise, (response) => {
        CucCloudMessage.success(successMessage);
        return response;
      }).catch((err) => {
        self.flags[flagName] = false;
        return $q.reject(err);
      });
    }

    function getConsole() {
      const promise = OvhApiDeskaasService.v6().console(
        { serviceName: $stateParams.serviceName },
        null,
      ).$promise;

      return handleServiceMethodCall(
        promise,
        $translate.instant('vdi_console_task'),
        'getConsoleAccess',
      ).then((response) => {
        handleTask(response.taskId, true);
      });
    }

    self.getConsole = function getConsoleFn() {
      return CucControllerHelper.modal
        .showModal({
          modalConfig: {
            templateUrl:
              'app/deskaas/deskaas-get-console-access/deskaas-get-console-access.html',
            controller: 'DeskaasGetConsoleAccessCtrl',
            controllerAs: 'DeskaasGetConsoleAccessCtrl',
            backdrop: 'static',
            size: 'md',
          },
        })
        .then(() => {
          getConsole().catch((err) => {
            const msg = get(err, 'data.message', '');
            CucCloudMessage.error(
              [$translate.instant('common_api_error'), msg].join(' '),
            );
          });
        });
    };

    self.deleteService = function deleteService() {
      return CucControllerHelper.modal
        .showConfirmationModal({
          titleText: $translate.instant('vdi_btn_delete'),
          text: $translate.instant('vdi_confirm_delete'),
        })
        .then(() => {
          const promise = OvhApiDeskaasService.v6().deleteService(
            { serviceName: $stateParams.serviceName },
            null,
          ).$promise;

          return handleServiceMethodCall(
            promise,
            $translate.instant('vdi_deleting'),
            'deleting',
          );
        });
    };

    function resetPassword(passwordParams) {
      let promise;

      if (passwordParams.generatePwd) {
        promise = OvhApiDeskaasService.v6().resetPassword(
          { serviceName: $stateParams.serviceName },
          null,
        ).$promise;
      } else if (passwordParams.password) {
        promise = OvhApiDeskaasService.v6().resetPassword(
          {
            serviceName: $stateParams.serviceName,
          },
          {
            password: passwordParams.password,
          },
        ).$promise;
      } else {
        return $q.when();
      }

      return handleServiceMethodCall(
        promise,
        $translate.instant('vdi_resetting_password'),
        'resettingPassword',
      ).then((response) => {
        handleTask(response.taskId, true);
      });
    }

    self.resetPassword = function resetPasswordFn() {
      const modal = $uibModal.open({
        templateUrl:
          'app/deskaas/deskaas-change-password/deskaas-change-password.html',
        controller: 'DeskaasChangePasswordCtrl',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          service() {
            return self.serviceName;
          },
        },
      });

      modal.result.then((modalValues) => {
        resetPassword(modalValues).catch((err) => {
          const msg = get(err, 'data.message', '');
          CucCloudMessage.error(
            [$translate.instant('common_api_error'), msg].join(' '),
          );
        });
      });
    };

    self.restoreService = function restoreService() {
      return CucControllerHelper.modal
        .showConfirmationModal({
          titleText: $translate.instant('vdi_btn_restore'),
          text: $translate.instant('vdi_confirm_restore'),
        })
        .then(() => {
          const promise = OvhApiDeskaasService.v6().restoreService(
            { serviceName: $stateParams.serviceName },
            null,
          ).$promise;

          return handleServiceMethodCall(
            promise,
            $translate.instant('vdi_restoring'),
            'restoring',
          ).then((response) => {
            handleTask(response.taskId);
          });
        });
    };

    self.rebootService = function rebootService() {
      return CucControllerHelper.modal
        .showConfirmationModal({
          titleText: $translate.instant('vdi_btn_reboot'),
          text: $translate.instant('vdi_confirm_reboot'),
        })
        .then(() => {
          const promise = OvhApiDeskaasService.v6().rebootService(
            { serviceName: $stateParams.serviceName },
            null,
          ).$promise;

          return handleServiceMethodCall(
            promise,
            $translate.instant('vdi_rebooting'),
            'rebooting',
          ).then((response) => {
            handleTask(response.taskId);
          });
        });
    };

    self.serviceInfos = function serviceInfos() {
      self.flags.init.serviceInfos = true;

      const promise = OvhApiDeskaasService.v6().serviceInfos({
        serviceName: $stateParams.serviceName,
      }).$promise;

      return handleMethodCall(promise, (response) => {
        self.services = response;
      }).finally(() => {
        self.flags.init.serviceInfos = false;
      });
    };

    self.hasValidAlias = function hasValidAlias() {
      const alias = get(self, 'details.alias', 'noAlias');
      return alias && alias !== 'noAlias';
    };

    function changeAlias(newDisplayName) {
      let promise;

      if (newDisplayName) {
        promise = OvhApiDeskaasService.v6().changeAlias(
          {
            serviceName: $stateParams.serviceName,
          },
          {
            alias: newDisplayName,
          },
        ).$promise;
      } else {
        return $q.when();
      }

      return handleServiceMethodCall(
        promise,
        $translate.instant('vdi_alias_changing'),
        'changingAlias',
      ).then((response) => {
        handleTask(response.taskId, false);
      });
    }

    self.changeAlias = function changeAliasFn() {
      CucControllerHelper.modal
        .showNameChangeModal({
          serviceName: self.details.serviceName,
          displayName:
            self.details.alias !== 'noAlias' ? self.details.alias : '',
        })
        .then((newDisplayName) => {
          changeAlias(newDisplayName).catch((err) => {
            const msg = get(err, 'data.message', '');
            CucCloudMessage.error(
              [$translate.instant('common_api_error'), msg].join(' '),
            );
          });
        });
    };

    self.upgrade = function upgrade() {
      $state.go('deskaas.details.upgrade', {
        serviceName: self.serviceName,
        references: self.upgradeOptions,
      });
    };

    function changeUsername(modalData) {
      let promise;

      if (modalData.newUsername) {
        promise = OvhApiDeskaasService.v6().changeUsername(
          {
            serviceName: $stateParams.serviceName,
          },
          {
            username: modalData.newUsername,
          },
        ).$promise;
      } else {
        return $q.when();
      }

      return handleServiceMethodCall(
        promise,
        $translate.instant('vdi_username_changing'),
        'changingUsername',
      ).then((response) => {
        handleTask(response.taskId, true);
      });
    }

    self.changeUsername = function changeUsernameFn() {
      const modal = $uibModal.open({
        templateUrl:
          'app/deskaas/deskaas-change-username/deskaas-change-username.html',
        controller: 'DeskaasChangeUsernameCtrl',
        controllerAs: 'DeskaasChangeUsernameCtrl',
        backdrop: 'static',
        size: 'md',
        resolve: {
          service() {
            return self.serviceName;
          },
        },
      });

      modal.result.then((modalData) => {
        changeUsername(modalData).catch((err) => {
          const msg = get(err, 'data.message', '');
          CucCloudMessage.error(
            [$translate.instant('common_api_error'), msg].join(' '),
          );
        });
      });
    };

    function confirmTerminate(terminateParams) {
      let promise;

      if (terminateParams.token && terminateParams.reason) {
        promise = OvhApiDeskaasService.v6().confirmTerminate(
          {
            serviceName: $stateParams.serviceName,
          },
          {
            token: terminateParams.token,
            reason: terminateParams.reason,
            commentary: terminateParams.commentary,
          },
        ).$promise;
      } else {
        return $q.when();
      }

      return handleServiceMethodCall(
        promise,
        $translate.instant('vdi_terminate_confirming'),
        'confirmingTerminate',
      ).then((response) => {
        handleTask(response.taskId, true);
      });
    }

    self.confirmTerminate = function confirmTerminateFn() {
      return CucControllerHelper.modal
        .showModal({
          modalConfig: {
            templateUrl:
              'app/deskaas/deskaas-confirm-terminate/deskaas-confirm-terminate.html',
            controller: 'DeskaasConfirmTerminateCtrl',
            controllerAs: 'DeskaasConfirmTerminateCtrl',
            backdrop: 'static',
            size: 'md',
            resolve: {
              service() {
                return self.serviceName;
              },
              token() {
                return $stateParams.token;
              },
            },
          },
        })
        .then((modalData) => {
          confirmTerminate(modalData).catch((err) => {
            const msg = get(err, 'data.message', '');
            CucCloudMessage.error(
              [$translate.instant('common_api_error'), msg].join(' '),
            );
          });
        });
    };

    self.getDetails = function getDetails() {
      self.flags.init.details = true;

      const promise = DeskaasService.getDetails($stateParams.serviceName);

      return handleMethodCall(promise, (response) => {
        response.displayName =
          response.alias === 'noAlias' ? response.serviceName : response.alias;
        self.services.offer = get(self.references[response.planCode], 'name');
        self.details = response;
      }).finally(() => {
        self.flags.init.details = false;
      });
    };

    self.getUser = function getUser() {
      self.flags.init.user = true;

      const promise = OvhApiDeskaasService.v6().getUser({
        serviceName: $stateParams.serviceName,
      }).$promise;

      return handleMethodCall(promise, (response) => {
        self.user = response;
      }).finally(() => {
        self.flags.init.user = false;
      });
    };

    self.taskBackgroud = function taskBackgroud(task) {
      if (task.state === 'error') {
        return 'bg-danger';
      }
      if (task.state === 'todo') {
        return 'bg-info';
      }
      if (task.state === 'done') {
        return 'bg-success';
      }
      return 'bg-warning';
    };

    function getInitTasks(taskIds) {
      if (taskIds.length === 0) {
        self.flags.init.getTasks = false;
        return $q.when();
      }
      if (taskIds.length > 1) {
        return OvhApiDeskaasService.v6()
          .getTaskBatch(
            { serviceName: $stateParams.serviceName, taskId: taskIds },
            null,
          )
          .$promise.then((tasksDetails) => {
            tasksDetails.forEach((taskDetail) => {
              updateTasksStatus(taskDetail.value);
            });
            self.flags.init.getTasks = false;
          });
      }
      return OvhApiDeskaasService.v6()
        .getTask(
          { serviceName: $stateParams.serviceName, taskId: taskIds },
          null,
        )
        .$promise.then((tasksDetail) => {
          updateTasksStatus(tasksDetail);
          self.flags.init.getTasks = false;
        });
    }

    self.changeMenuTitle = function changeMenuTitle(serviceName, displayName) {
      const menuItem = SidebarMenu.getItemById(serviceName);
      if (menuItem) {
        menuItem.title = displayName;
      }
    };

    self.getRunningTasks = function getRunningTasks() {
      self.flags.init.getTasks = true;

      return $q
        .all([
          OvhApiDeskaasService.v6().getAllTasks(
            { serviceName: $stateParams.serviceName },
            null,
          ).$promise,
          OvhApiDeskaasService.v6().getDoneTasks(
            { serviceName: $stateParams.serviceName },
            null,
          ).$promise,
          OvhApiDeskaasService.v6().getCanceledTasks(
            { serviceName: $stateParams.serviceName },
            null,
          ).$promise,
        ])
        .then((elements) => {
          let tasks = elements[0];

          tasks = difference(tasks, elements[1]);
          tasks = difference(tasks, elements[2]);

          return tasks;
        })
        .then((runningTasks) => {
          getInitTasks(runningTasks);
        });
    };

    init(true);
  });
